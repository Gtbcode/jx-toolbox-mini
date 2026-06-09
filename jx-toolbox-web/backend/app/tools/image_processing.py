"""图片处理工具配置逻辑。"""

from app.tools.storage import get_tool_settings, save_tool_settings


# 图片水印、打码和基础编辑均在浏览器本地完成，后端保存处理偏好。
TOOL_KEY = "image-processing"


def init_tables():
    """图片处理复用通用配置表，不需要额外建表。"""
    return None


def get_settings(user):
    """读取当前账号的图片处理配置。"""
    return get_tool_settings(user, TOOL_KEY)


def save_settings(user, settings):
    """保存当前账号的图片处理配置。"""
    save_tool_settings(user, TOOL_KEY, settings or {})
