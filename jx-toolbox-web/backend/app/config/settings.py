"""应用配置集中管理，统一读取环境变量和 backend/.env。"""

from functools import lru_cache
from pathlib import Path
from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


# 这些路径用于定位 backend/.env 和根目录 ui 静态资源。
BACKEND_DIR = Path(__file__).resolve().parents[2]
PROJECT_ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    """个人工具平台的全部运行时配置。"""

    model_config = SettingsConfigDict(
        env_file=str(BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # 应用基础配置。
    app_name: str = "Personal Toolbox"
    app_version: str = "platform-fastapi-v2"
    debug: bool = Field(default=False, validation_alias="APP_DEBUG")
    api_prefix: str = "/api/v2"

    # HTTP 服务配置。
    app_host: str = Field(default="127.0.0.1", validation_alias="APP_HOST")
    port: int = Field(default=5173, validation_alias="PORT")
    session_ttl_seconds: int = 60 * 60 * 24 * 7
    admin_default_password: str = Field(
        default="",
        validation_alias="ADMIN_DEFAULT_PASSWORD",
    )

    # PostgreSQL 连接配置，兼容现有 .env 的 PG* 命名。
    pg_host: str = Field(default="127.0.0.1", validation_alias="PGHOST")
    pg_port: int = Field(default=5432, validation_alias="PGPORT")
    pg_user: str = Field(default="postgres", validation_alias="PGUSER")
    pg_password: str = Field(default="", validation_alias="PGPASSWORD")
    pg_database: str = Field(default="postgres", validation_alias="PGDATABASE")
    pg_connect_timeout: int = Field(default=5, validation_alias="PGCONNECT_TIMEOUT")

    # DeepSeek 分析工具配置。
    deepseek_api_key: Optional[str] = Field(default=None, validation_alias="DEEPSEEK_API_KEY")
    deepseek_model: str = Field(default="deepseek-v4-flash", validation_alias="DEEPSEEK_MODEL")
    deepseek_endpoint: str = "https://api.deepseek.com/chat/completions"
    deepseek_daily_limit: int = 3

    # 本地开发允许的跨域来源。
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    @property
    def ui_dir(self) -> Path:
        """返回静态前端目录。"""
        return PROJECT_ROOT / "ui"

    @property
    def postgres_connect_kwargs(self) -> dict[str, object]:
        """生成 psycopg/psycopg2 可直接使用的连接参数。"""
        return {
            "host": self.pg_host,
            "port": self.pg_port,
            "user": self.pg_user,
            "password": self.pg_password,
            "dbname": self.pg_database,
            "connect_timeout": self.pg_connect_timeout,
        }


@lru_cache
def get_settings() -> Settings:
    """缓存配置对象，避免每次请求重复解析环境变量。"""
    return Settings()


settings = get_settings()

