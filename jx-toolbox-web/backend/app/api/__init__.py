"""API 路由总入口，只注册新的 /api/v2 平台化接口。"""

from fastapi import APIRouter

from app.api.v2 import build_router
from app.config.settings import settings


# 不再保留旧 /api 兼容路径，前后端统一使用 /api/v2。
api_router = APIRouter()
api_router.include_router(build_router(settings.api_prefix))

__all__ = ["api_router"]

