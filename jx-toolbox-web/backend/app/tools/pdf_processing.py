"""PDF 处理工具配置逻辑。"""

from app.tools.storage import get_tool_settings, save_tool_settings


# PDF 具体处理在浏览器本地完成，后端保存水印、打码等偏好配置。
TOOL_KEY = "pdf-processing"


def init_tables():
    """PDF 处理复用通用配置表，不需要额外建表。"""
    return None


def get_settings(user):
    """读取当前账号的 PDF 处理配置。"""
    return get_tool_settings(user, TOOL_KEY)


def save_settings(user, settings):
    """保存当前账号的 PDF 处理配置。"""
    save_tool_settings(user, TOOL_KEY, settings or {})
