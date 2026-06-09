"""图片打码工具配置逻辑。"""

from app.tools.storage import get_tool_settings, save_tool_settings


# 图片像素化在浏览器本地完成，后端只保存强度和下载格式等偏好。
TOOL_KEY = "image-mosaic"


def init_tables():
    """图片打码复用通用配置表，不需要额外建表。"""
    return None


def get_settings(user):
    """读取当前账号的图片打码配置。"""
    return get_tool_settings(user, TOOL_KEY)


def save_settings(user, settings):
    """保存当前账号的图片打码配置。"""
    save_tool_settings(user, TOOL_KEY, settings or {})

