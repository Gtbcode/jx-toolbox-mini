"""通用工具配置路由。"""

from fastapi import APIRouter, Depends

from app.api.deps import require_user
from app.schemas.tools import ToolSettingsPayload
from app.services import tool_settings_service


router = APIRouter(tags=["工具配置"])


@router.get("/tool-settings")
def get_tool_settings(tool: str, user=Depends(require_user)):
    """读取指定工具在当前账号下保存的 JSON 配置。"""
    if not tool:
        raise ValueError("缺少工具标识")
    return {"settings": tool_settings_service.get_settings(user, tool)}


@router.post("/tool-settings")
def save_tool_settings(payload: ToolSettingsPayload, user=Depends(require_user)):
    """保存指定工具在当前账号下的 JSON 配置。"""
    if not payload.tool:
        raise ValueError("缺少工具标识")
    tool_settings_service.save_settings(user, payload.tool, payload.settings)
    return {"ok": True}

