#!/usr/bin/env python3
"""个人工具平台的根目录统一启动入口。"""

from pathlib import Path
import sys

import uvicorn


# 将 backend 加入导入路径，保持 app.* 的平台化包导入方式。
PROJECT_ROOT = Path(__file__).resolve().parent
BACKEND_DIR = PROJECT_ROOT / "backend"
sys.path.insert(0, str(BACKEND_DIR))

from app.config.settings import settings  # noqa: E402


def main() -> None:
    """按配置启动 FastAPI 服务。"""
    uvicorn.run(
        "app.main:app",
        host=settings.app_host,
        port=settings.port,
        reload=settings.debug,
    )


if __name__ == "__main__":
    main()

