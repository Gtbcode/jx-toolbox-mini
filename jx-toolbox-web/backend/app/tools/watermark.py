"""文件水印工具配置逻辑。"""

from app.tools.storage import get_tool_settings, save_tool_settings


# 文件水印在前端本地处理 PDF/图片，后端只负责按账号保存配置。
TOOL_KEY = "watermark"


def get_settings(user):
    """读取当前账号的文件水印配置。"""
    return get_tool_settings(user, TOOL_KEY)


def save_settings(user, settings):
    """保存当前账号的文件水印配置。"""
    save_tool_settings(user, TOOL_KEY, settings or {})

