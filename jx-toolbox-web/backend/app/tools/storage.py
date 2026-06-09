"""通用工具配置存储能力。"""

import json

from app.config.database import execute


def init_tables():
    """创建通用工具配置表，供轻量工具复用。"""
    execute(
        """
        create table if not exists user_tool_settings (
          user_id bigint not null references app_users(id) on delete cascade,
          tool_key text not null,
          settings jsonb not null default '{}'::jsonb,
          updated_at timestamptz not null default now(),
          primary key (user_id, tool_key)
        );
        """
    )


def get_tool_settings(user, tool_key):
    """读取某个账号在指定工具下保存的 JSON 配置。"""
    rows = execute(
        """
        select settings
        from user_tool_settings
        where user_id = %s and tool_key = %s;
        """,
        [user["id"], tool_key],
        fetch=True,
    )
    if not rows:
        return {}
    value = rows[0][0]
    if isinstance(value, str):
        return json.loads(value)
    return value or {}


def save_tool_settings(user, tool_key, settings):
    """保存某个账号在指定工具下的 JSON 配置。"""
    execute(
        """
        insert into user_tool_settings (user_id, tool_key, settings)
        values (%s, %s, %s::jsonb)
        on conflict (user_id, tool_key)
        do update set settings = excluded.settings, updated_at = now();
        """,
        [user["id"], tool_key, json.dumps(settings, ensure_ascii=False)],
    )

