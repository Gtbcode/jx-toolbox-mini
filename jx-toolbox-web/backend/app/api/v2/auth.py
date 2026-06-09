"""账号认证路由，负责登录、退出和密码维护。"""

from fastapi import APIRouter, Depends, HTTPException, Request, Response

from app.api.deps import get_current_user, require_admin, require_user
from app.config.settings import settings
from app.schemas.auth import ChangePasswordRequest, LoginRequest, ResetPasswordRequest
from app.services import auth_service


router = APIRouter(tags=["账号认证"])


@router.get("/me")
def me(current_user=Depends(get_current_user)):
    """返回当前登录账号；未登录时 user 为 None。"""
    return {"user": current_user}


@router.post("/login")
def login(payload: LoginRequest, response: Response):
    """校验用户名和密码，成功后写入 HttpOnly Session Cookie。"""
    user = auth_service.find_user(payload.username)
    if not user or not auth_service.verify_password(payload.password or "", user["passwordHash"]):
        raise HTTPException(status_code=401, detail="用户名或密码错误")

    token = auth_service.create_session(user)
    response.set_cookie(
        "session_id",
        token,
        httponly=True,
        samesite="lax",
        path="/",
        max_age=settings.session_ttl_seconds,
    )
    return {"user": auth_service.public_user(user)}


@router.post("/logout")
def logout(request: Request, response: Response, current_user=Depends(get_current_user)):
    """清理服务端 Session，并删除浏览器 Cookie。"""
    del current_user
    auth_service.clear_session(request.cookies.get("session_id"))
    response.delete_cookie("session_id", path="/")
    return {"ok": True}


@router.post("/password/reset")
def reset_password(payload: ResetPasswordRequest, admin=Depends(require_admin)):
    """管理员重置指定账号密码。"""
    del admin
    auth_service.reset_password(payload.username, payload.newPassword)
    return {"ok": True}


@router.post("/password/change")
def change_password(payload: ChangePasswordRequest, user=Depends(require_user)):
    """登录用户修改自己的密码。"""
    auth_service.change_password(user, payload.oldPassword, payload.newPassword)
    return {"ok": True}

