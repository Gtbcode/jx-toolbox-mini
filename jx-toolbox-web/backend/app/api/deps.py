"""API 依赖项，集中处理登录态和管理员权限。"""

from fastapi import Depends, HTTPException, Request

from app.services import auth_service


def get_current_user(request: Request):
    """从 session_id Cookie 中解析当前用户；未登录时返回 None。"""
    return auth_service.get_user_by_token(request.cookies.get("session_id"))


def require_user(current_user=Depends(get_current_user)):
    """要求用户已登录，未登录时返回 401。"""
    if not current_user:
        raise HTTPException(status_code=401, detail="请先登录")
    return current_user


def require_admin(current_user=Depends(require_user)):
    """要求当前用户是管理员，普通账号不能访问账号管理接口。"""
    if not current_user.get("isAdmin"):
        raise HTTPException(status_code=401, detail="需要管理员权限")
    return current_user

