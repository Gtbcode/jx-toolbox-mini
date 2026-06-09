"""API v2 路由包，按业务域拆分路由文件。"""

from fastapi import APIRouter

from app.api.v2 import auth, deepseek, tool_settings, users, weight


# 新增工具时，在这里追加对应 router，保持入口清晰。
routers = [
    auth.router,
    users.router,
    weight.router,
    tool_settings.router,
    deepseek.router,
]


def build_router(prefix: str) -> APIRouter:
    """按统一前缀组装 v2 路由。"""
    router = APIRouter(prefix=prefix)
    for child_router in routers:
        router.include_router(child_router)
    return router

