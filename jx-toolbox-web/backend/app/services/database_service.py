"""启动阶段的数据表初始化服务。"""

from app import tools
from app.services import auth_service


def init_database() -> None:
    """按依赖顺序初始化账号表和所有工具表。"""
    auth_service.init_tables()
    tools.init_tables()

