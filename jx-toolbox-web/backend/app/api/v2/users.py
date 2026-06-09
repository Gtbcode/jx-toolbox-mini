"""账号管理路由，仅管理员可用。"""

from fastapi import APIRouter, Depends

from app.api.deps import require_admin
from app.schemas.auth import UserUpsertRequest
from app.services import auth_service
from app.tools import weight


router = APIRouter(tags=["账号管理"])


@router.get("/users")
def list_users(admin=Depends(require_admin)):
    """列出所有账号，供管理后台展示。"""
    del admin
    return {"users": auth_service.list_users()}


@router.post("/users")
def save_user(payload: UserUpsertRequest, current_user=Depends(require_admin)):
    """新增账号或修改已有账号信息。"""
    if payload.id:
        if int(payload.id) == int(current_user["id"]):
            raise ValueError("当前登录账号请通过修改密码入口维护")
        auth_service.update_user(
            payload.id,
            payload.displayName,
            payload.password or None,
            bool(payload.isAdmin),
        )
    else:
        user = auth_service.create_user(
            payload.username,
            payload.displayName,
            payload.password,
            bool(payload.isAdmin),
        )
        # 新账号创建后立即补齐体重工具的默认资料行。
        weight.ensure_profile(user)
    return {"ok": True}


@router.delete("/users")
def delete_user(id: str, current_user=Depends(require_admin)):
    """删除普通账号；当前账号和内置 admin 不允许删除。"""
    auth_service.delete_user(id, current_user)
    return {"ok": True}

