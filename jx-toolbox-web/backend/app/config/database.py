"""同步 PostgreSQL 访问工具，供服务层和工具模块复用。"""

from datetime import date
from decimal import Decimal

from app.config.settings import settings

try:
    import psycopg
except ImportError:
    psycopg = None

try:
    import psycopg2
except ImportError:
    psycopg2 = None


def get_connection():
    """创建数据库连接，优先使用 psycopg3，缺失时回退到 psycopg2。"""
    config = settings.postgres_connect_kwargs
    if psycopg is not None:
        return psycopg.connect(**config)
    if psycopg2 is not None:
        return psycopg2.connect(**config)
    raise RuntimeError("缺少 PostgreSQL 驱动，请先执行：pip install -r backend/requirements.txt")


def normalize_value(value):
    """把数据库类型转换成前端 JSON 更容易处理的类型。"""
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, date):
        return value.isoformat()
    return value


def execute(sql: str, params=None, fetch: bool = False):
    """统一执行 SQL，负责连接、提交和可选结果读取。"""
    params = params or []
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(sql, params)
            rows = cursor.fetchall() if fetch else None
        conn.commit()
    return rows

