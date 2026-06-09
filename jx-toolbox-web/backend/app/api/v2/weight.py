"""体重趋势工具路由。"""

from fastapi import APIRouter, Depends

from app.api.deps import require_user
from app.schemas.tools import ClearRecordsRequest, ProfileSettingsUpdate, WeightRecordUpsert
from app.tools import weight


router = APIRouter(tags=["体重趋势"])


@router.get("/profiles")
def get_profiles(user=Depends(require_user)):
    """读取当前账号的体重资料和所有记录。"""
    return weight.get_profiles(user)


@router.put("/settings")
def update_settings(payload: ProfileSettingsUpdate, user=Depends(require_user)):
    """更新目标体重、身高和性别配置。"""
    weight.update_settings(payload.model_dump(), user)
    return {"ok": True}


@router.post("/records")
def upsert_record(payload: WeightRecordUpsert, user=Depends(require_user)):
    """新增或覆盖同一天的体重记录。"""
    weight.upsert_record(payload.model_dump(), user)
    return {"ok": True}


@router.delete("/records")
def delete_record(profileKey: str, date: str, user=Depends(require_user)):
    """删除指定日期的体重记录。"""
    weight.delete_record(profileKey, date, user)
    return {"ok": True}


@router.post("/records/clear")
def clear_records(payload: ClearRecordsRequest, user=Depends(require_user)):
    """清空当前账号的全部体重记录。"""
    weight.clear_records(payload.profileKey, user)
    return {"ok": True}

