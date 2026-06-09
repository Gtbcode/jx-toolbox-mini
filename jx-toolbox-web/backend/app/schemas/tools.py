"""工具相关 API 的请求数据结构。"""

from typing import Any

from pydantic import BaseModel, Field


class ProfileSettingsUpdate(BaseModel):
    """体重资料配置更新请求。"""

    profileKey: str
    target: float | str | None = None
    height: float | str | None = None
    gender: str | None = None


class WeightRecordUpsert(BaseModel):
    """体重记录新增或覆盖请求。"""

    profileKey: str
    date: str
    weight: float
    note: str | None = None


class ClearRecordsRequest(BaseModel):
    """清空体重记录请求。"""

    profileKey: str


class ToolSettingsPayload(BaseModel):
    """通用工具配置保存请求。"""

    tool: str
    settings: dict[str, Any] = Field(default_factory=dict)

