"""账号、密码和内存 Session 服务。"""

import hashlib
import secrets
import time

from app.config.database import execute
from app.config.settings import settings


# 当前项目是个人工具平台，Session 暂存在进程内存中；重启后需要重新登录。
SESSIONS: dict[str, dict[str, object]] = {}


def init_tables() -> None:
    """初始化账号表，并确保内置管理员账号存在。"""
    execute(
        """
        create table if not exists app_users (
          id bigserial primary key,
          username text not null unique,
          display_name text not null,
          password_hash text not null,
          is_admin boolean not null default false,
          created_at timestamptz not null default now()
        );
        """
    )
    execute("alter table app_users add column if not exists is_admin boolean not null default false;")
    ensure_default_admin()


def ensure_default_admin() -> None:
    """确保 admin 管理员存在，便于首次进入平台创建其他账号。"""
    rows = execute("select id from app_users where username = 'admin';", fetch=True)
    if rows:
        execute("update app_users set is_admin = true where username = 'admin';")
        return
    execute(
        """
        insert into app_users (username, display_name, password_hash, is_admin)
        values ('admin', '管理员', %s, true);
        """,
        [hash_password(settings.admin_default_password)],
    )


def hash_password(password: str, salt: str | None = None) -> str:
    """使用 PBKDF2-HMAC-SHA256 生成带盐密码哈希。"""
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        200000,
    )
    return f"{salt}${digest.hex()}"


def verify_password(password: str, password_hash: str) -> bool:
    """校验用户输入密码是否匹配数据库中的哈希。"""
    try:
        salt, expected = password_hash.split("$", 1)
    except ValueError:
        return False
    return secrets.compare_digest(hash_password(password, salt).split("$", 1)[1], expected)


def create_user(username, display_name, password, is_admin: bool = False):
    """创建新账号，并返回前端可展示的基础账号信息。"""
    username = (username or "").strip().lower()
    display_name = (display_name or "").strip() or username
    if len(username) < 2:
        raise ValueError("用户名至少 2 个字符")
    if len(password or "") < 6:
        raise ValueError("密码至少 6 个字符")
    if find_user(username):
        raise ValueError("用户名已存在")

    rows = execute(
        """
        insert into app_users (username, display_name, password_hash, is_admin)
        values (%s, %s, %s, %s)
        returning id, username, display_name, is_admin;
        """,
        [username, display_name, hash_password(password), bool(is_admin)],
        fetch=True,
    )
    return {
        "id": rows[0][0],
        "username": rows[0][1],
        "displayName": rows[0][2],
        "isAdmin": rows[0][3],
    }


def reset_password(username, new_password) -> None:
    """管理员按用户名重置账号密码。"""
    username = (username or "").strip().lower()
    if len(new_password or "") < 6:
        raise ValueError("新密码至少 6 个字符")
    if not find_user(username):
        raise ValueError("用户不存在")

    execute(
        """
        update app_users
        set password_hash = %s
        where username = %s;
        """,
        [hash_password(new_password), username],
    )


def change_password(user, old_password, new_password) -> None:
    """登录用户校验旧密码后修改自己的密码。"""
    current = find_user(user["username"])
    if not current or not verify_password(old_password or "", current["passwordHash"]):
        raise ValueError("当前密码错误")
    if len(new_password or "") < 6:
        raise ValueError("新密码至少 6 个字符")
    execute(
        """
        update app_users
        set password_hash = %s
        where id = %s;
        """,
        [hash_password(new_password), user["id"]],
    )


def list_users():
    """按管理员优先、用户名升序返回账号列表。"""
    rows = execute(
        """
        select id, username, display_name, is_admin, created_at
        from app_users
        order by is_admin desc, username asc;
        """,
        fetch=True,
    )
    return [
        {
            "id": row[0],
            "username": row[1],
            "displayName": row[2],
            "isAdmin": row[3],
            "createdAt": row[4].isoformat() if row[4] else "",
        }
        for row in rows
    ]


def update_user(user_id, display_name, password=None, is_admin: bool = False) -> None:
    """管理员修改账号昵称、密码和管理员权限。"""
    if not user_id:
        raise ValueError("缺少账号 ID")
    display_name = (display_name or "").strip()
    if not display_name:
        raise ValueError("昵称不能为空")
    if password:
        if len(password) < 6:
            raise ValueError("密码至少 6 个字符")
        execute(
            """
            update app_users
            set display_name = %s, password_hash = %s, is_admin = %s
            where id = %s;
            """,
            [display_name, hash_password(password), bool(is_admin), user_id],
        )
        return

    execute(
        """
        update app_users
        set display_name = %s, is_admin = %s
        where id = %s;
        """,
        [display_name, bool(is_admin), user_id],
    )


def delete_user(user_id, current_user) -> None:
    """删除账号，禁止删除当前登录账号和内置 admin。"""
    if not user_id:
        raise ValueError("缺少账号 ID")
    if int(user_id) == int(current_user["id"]):
        raise ValueError("不能删除当前登录账号")
    execute("delete from app_users where id = %s and username <> 'admin';", [user_id])


def find_user(username):
    """按用户名查找账号，返回包含密码哈希的内部用户对象。"""
    rows = execute(
        """
        select id, username, display_name, password_hash, is_admin
        from app_users
        where username = %s;
        """,
        [(username or "").strip().lower()],
        fetch=True,
    )
    if not rows:
        return None
    row = rows[0]
    return {
        "id": row[0],
        "username": row[1],
        "displayName": row[2],
        "passwordHash": row[3],
        "isAdmin": row[4],
    }


def public_user(user):
    """去掉 passwordHash，只返回可以发给前端的账号信息。"""
    return {
        "id": user["id"],
        "username": user["username"],
        "displayName": user["displayName"],
        "isAdmin": bool(user.get("isAdmin")),
    }


def create_session(user) -> str:
    """创建内存 Session，并返回写入 Cookie 的随机 token。"""
    token = secrets.token_urlsafe(32)
    SESSIONS[token] = {
        "user": public_user(user),
        "expires": time.time() + settings.session_ttl_seconds,
    }
    return token


def get_user_by_token(token: str | None):
    """根据 Cookie token 读取当前用户，过期时自动清理。"""
    if not token:
        return None
    session = SESSIONS.get(token)
    if not session:
        return None
    if float(session["expires"]) < time.time():
        SESSIONS.pop(token, None)
        return None
    return session["user"]


def clear_session(token: str | None) -> None:
    """退出登录时清理服务端内存 Session。"""
    if token:
        SESSIONS.pop(token, None)

