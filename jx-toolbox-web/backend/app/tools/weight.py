"""体重趋势工具的数据库和业务逻辑。"""

from app.config.database import execute, normalize_value


def init_tables():
    """创建体重工具需要的个人资料表和体重记录表。"""
    execute(
        """
        create table if not exists user_weight_profiles (
          user_id bigint primary key references app_users(id) on delete cascade,
          target_weight numeric(6, 2),
          height_cm numeric(5, 1),
          gender text not null default 'unspecified',
          updated_at timestamptz not null default now()
        );
        """
    )
    execute("alter table user_weight_profiles add column if not exists gender text not null default 'unspecified';")
    execute(
        """
        create table if not exists user_weight_records (
          id bigserial primary key,
          user_id bigint not null references app_users(id) on delete cascade,
          record_date date not null,
          weight_kg numeric(6, 2) not null,
          note text not null default '',
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now(),
          unique (user_id, record_date)
        );
        """
    )


def ensure_profile(user):
    """确保账号拥有一条默认体重资料记录。"""
    execute(
        """
        insert into user_weight_profiles (user_id, target_weight, height_cm)
        values (%s, null, null)
        on conflict (user_id) do nothing;
        """,
        [user["id"]],
    )


def get_profiles(user):
    """读取当前账号的体重资料和全部体重记录。"""
    ensure_profile(user)
    profile_rows = execute(
        """
        select target_weight, height_cm, gender
        from user_weight_profiles
        where user_id = %s;
        """,
        [user["id"]],
        fetch=True,
    )
    record_rows = execute(
        """
        select record_date, weight_kg, note
        from user_weight_records
        where user_id = %s
        order by record_date asc;
        """,
        [user["id"]],
        fetch=True,
    )

    target_weight, height_cm, gender = profile_rows[0] if profile_rows else (None, None, "unspecified")
    profiles = {
        "self": {
            "name": user["displayName"],
            "settings": {
                "target": "" if target_weight is None else normalize_value(target_weight),
                "height": "" if height_cm is None else normalize_value(height_cm),
                "gender": gender or "unspecified",
            },
            "records": [],
        }
    }

    for record_date, weight_kg, note in record_rows:
        profiles["self"]["records"].append(
            {
                "date": normalize_value(record_date),
                "weight": normalize_value(weight_kg),
                "note": note or "",
            }
        )

    return profiles


def update_settings(payload, user):
    """更新目标体重、身高和性别配置。"""
    assert_profile_key(payload.get("profileKey"))
    target = payload.get("target")
    height = payload.get("height")
    gender = payload.get("gender") or "unspecified"
    target = None if target in ("", None) else float(target)
    height = None if height in ("", None) else float(height)
    if gender not in {"male", "female", "unspecified"}:
        raise ValueError("无效的性别配置")

    execute(
        """
        insert into user_weight_profiles (user_id, target_weight, height_cm, gender)
        values (%s, %s, %s, %s)
        on conflict (user_id)
        do update set
          target_weight = excluded.target_weight,
          height_cm = excluded.height_cm,
          gender = excluded.gender,
          updated_at = now();
        """,
        [user["id"], target, height, gender],
    )


def upsert_record(payload, user):
    """新增或覆盖同一天的体重记录。"""
    assert_profile_key(payload.get("profileKey"))
    execute(
        """
        insert into user_weight_records (user_id, record_date, weight_kg, note)
        values (%s, %s, %s, %s)
        on conflict (user_id, record_date)
        do update set weight_kg = excluded.weight_kg, note = excluded.note, updated_at = now();
        """,
        [
            user["id"],
            payload.get("date"),
            float(payload.get("weight")),
            payload.get("note") or "",
        ],
    )


def delete_record(profile_key, record_date, user):
    """删除指定日期的体重记录。"""
    assert_profile_key(profile_key)
    execute(
        "delete from user_weight_records where user_id = %s and record_date = %s;",
        [user["id"], record_date],
    )


def clear_records(profile_key, user):
    """清空当前账号的全部体重记录。"""
    assert_profile_key(profile_key)
    execute("delete from user_weight_records where user_id = %s;", [user["id"]])


def assert_profile_key(profile_key):
    """当前平台只允许访问当前登录账号本人的记录对象。"""
    if profile_key != "self":
        raise ValueError("无效的记录对象")

