"""DeepSeek 明日体重分析工具逻辑。"""

import json
import urllib.error
import urllib.request

from app.config.database import execute
from app.config.settings import settings
from app.tools.storage import get_tool_settings, save_tool_settings


DEEPSEEK_ENDPOINT = settings.deepseek_endpoint
DEEPSEEK_MODEL = settings.deepseek_model
DEEPSEEK_DAILY_LIMIT = settings.deepseek_daily_limit
ANALYSIS_TOOL_KEY = "deepseek-analysis"


def init_tables():
    """创建 DeepSeek 每日调用次数表。"""
    execute(
        """
        create table if not exists user_deepseek_usage (
          user_id bigint not null references app_users(id) on delete cascade,
          usage_date date not null default current_date,
          request_count integer not null default 0,
          updated_at timestamptz not null default now(),
          primary key (user_id, usage_date)
        );
        """
    )


def get_analysis_settings(user):
    """读取当前账号最后一次保存的 DeepSeek 分析结果。"""
    return get_tool_settings(user, ANALYSIS_TOOL_KEY)


def save_analysis_settings(user, settings_value):
    """保存当前账号最后一次 DeepSeek 分析上下文和结果。"""
    save_tool_settings(user, ANALYSIS_TOOL_KEY, settings_value or {})


def get_usage_count(user):
    """获取当前账号今天已经成功调用 DeepSeek 的次数。"""
    rows = execute(
        """
        select request_count
        from user_deepseek_usage
        where user_id = %s and usage_date = current_date;
        """,
        [user["id"]],
        fetch=True,
    )
    return int(rows[0][0]) if rows else 0


def get_usage(user):
    """返回前端展示用的已用次数和每日上限。"""
    return {"used": get_usage_count(user), "limit": DEEPSEEK_DAILY_LIMIT}


def increment_usage(user):
    """DeepSeek 调用成功后将今日次数加一。"""
    execute(
        """
        insert into user_deepseek_usage (user_id, usage_date, request_count)
        values (%s, current_date, 1)
        on conflict (user_id, usage_date)
        do update set request_count = user_deepseek_usage.request_count + 1, updated_at = now();
        """,
        [user["id"]],
    )


def analyze(payload, user):
    """调用 DeepSeek API，并在成功后返回分析结果和最新调用次数。"""
    if get_usage_count(user) >= DEEPSEEK_DAILY_LIMIT:
        return 429, {"error": f"今日 DeepSeek 分析次数已用完，每个账号每天最多 {DEEPSEEK_DAILY_LIMIT} 次。"}

    api_key = settings.deepseek_api_key
    if not api_key:
        return 400, {"error": "缺少 DeepSeek API Key"}

    # 模型和 API Key 只在后端配置，前端只传 messages/temperature/max_tokens 等参数。
    payload = dict(payload or {})
    payload["model"] = DEEPSEEK_MODEL
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    request = urllib.request.Request(
        DEEPSEEK_ENDPOINT,
        data=body,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            increment_usage(user)
            response_payload = json.loads(response.read().decode("utf-8") or "{}")
            response_payload["dailyUsage"] = get_usage(user)
            return response.status, response_payload
    except urllib.error.HTTPError as error:
        response_body = error.read().decode("utf-8") or "{}"
        try:
            return error.code, json.loads(response_body)
        except json.JSONDecodeError:
            return error.code, {"error": response_body}

