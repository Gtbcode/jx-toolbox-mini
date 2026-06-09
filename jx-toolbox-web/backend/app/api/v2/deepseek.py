"""DeepSeek 明日分析路由。"""

from typing import Any

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.api.deps import require_user
from app.tools import deepseek


router = APIRouter(tags=["DeepSeek 分析"])


@router.get("/deepseek/usage")
def get_usage(user=Depends(require_user)):
    """返回当前账号今日 DeepSeek 使用次数。"""
    return deepseek.get_usage(user)


@router.post("/deepseek")
def analyze(payload: dict[str, Any], user=Depends(require_user)):
    """转发前端分析请求到 DeepSeek，并保持后端限流。"""
    status_code, response_payload = deepseek.analyze(payload, user)
    return JSONResponse(status_code=status_code, content=response_payload)

