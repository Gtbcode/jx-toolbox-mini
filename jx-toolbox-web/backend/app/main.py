"""FastAPI 应用入口，负责组装中间件、路由、静态前端和启动生命周期。"""

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api import api_router
from app.config.settings import settings
from app.middleware.error_handler import setup_exception_handlers
from app.services.database_service import init_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期：启动时初始化账号表和各工具需要的数据表。"""
    del app
    init_database()
    yield


def create_app() -> FastAPI:
    """创建 FastAPI 应用实例，供 uvicorn 和测试代码共同使用。"""
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    # 允许前端和 API 文档在本地开发环境跨域访问后端。
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 统一异常响应，并注册平台化 API 路由。
    setup_exception_handlers(app)
    app.include_router(api_router)

    @app.get("/health", tags=["system"])
    def health_check():
        """健康检查接口，用于启动验证和反向代理探活。"""
        return {"ok": True, "version": settings.app_version}

    @app.get("/debug/static", tags=["system"])
    def debug_static():
        """输出静态前端目录状态，方便排查部署路径问题。"""
        index_file = settings.ui_dir / "index.html"
        return {
            "version": settings.app_version,
            "ui_dir": str(settings.ui_dir),
            "index_file": str(index_file),
            "index_exists": index_file.exists(),
        }

    # 最后挂载静态前端，避免覆盖前面已经注册的 API 路由。
    ui_dir = Path(settings.ui_dir)
    if ui_dir.exists():
        app.mount("/", StaticFiles(directory=str(ui_dir), html=True), name="ui")

    return app


app = create_app()

