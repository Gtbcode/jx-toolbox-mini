"""工具配置服务，负责把通用配置请求分派给具体工具。"""

from app.tools import deepseek, image_mosaic, image_processing, pdf_processing, watermark
from app.tools.storage import get_tool_settings, save_tool_settings


def _merge_legacy_settings(user, tool_key: str, legacy_key: str) -> dict:
    """读取新工具 key 的配置，并在为空时回退到旧 key。"""
    current = get_tool_settings(user, tool_key)
    if current:
        return current
    legacy = get_tool_settings(user, legacy_key)
    if legacy:
        save_tool_settings(user, tool_key, legacy)
    return legacy or {}


def get_settings(user, tool_key: str):
    """读取指定工具配置，特殊工具可在这里定制读取逻辑。"""
    if tool_key == watermark.TOOL_KEY:
        return watermark.get_settings(user)
    if tool_key == image_mosaic.TOOL_KEY:
        return image_mosaic.get_settings(user)
    if tool_key == image_processing.TOOL_KEY:
        return _merge_legacy_settings(user, image_processing.TOOL_KEY, image_mosaic.TOOL_KEY)
    if tool_key == pdf_processing.TOOL_KEY:
        return _merge_legacy_settings(user, pdf_processing.TOOL_KEY, watermark.TOOL_KEY)
    if tool_key == deepseek.ANALYSIS_TOOL_KEY:
        return deepseek.get_analysis_settings(user)
    return get_tool_settings(user, tool_key)


def save_settings(user, tool_key: str, settings: dict) -> None:
    """保存指定工具配置，特殊工具可在这里定制保存逻辑。"""
    if tool_key == watermark.TOOL_KEY:
        watermark.save_settings(user, settings)
    elif tool_key == image_mosaic.TOOL_KEY:
        image_mosaic.save_settings(user, settings)
    elif tool_key == image_processing.TOOL_KEY:
        image_processing.save_settings(user, settings)
    elif tool_key == pdf_processing.TOOL_KEY:
        pdf_processing.save_settings(user, settings)
    elif tool_key == deepseek.ANALYSIS_TOOL_KEY:
        deepseek.save_analysis_settings(user, settings)
    else:
        save_tool_settings(user, tool_key, settings)
