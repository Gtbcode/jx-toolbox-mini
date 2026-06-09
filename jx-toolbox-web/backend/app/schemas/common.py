"""通用响应数据结构。"""

from typing import Any

from pydantic import BaseModel


class ErrorResponse(BaseModel):
    """统一错误响应结构。"""

    error: str
    details: Any | None = None

