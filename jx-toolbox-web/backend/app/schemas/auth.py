"""账号相关 API 的请求数据结构。"""

from pydantic import BaseModel


class LoginRequest(BaseModel):
    """登录请求。"""

    username: str | None = None
    password: str | None = None


class ChangePasswordRequest(BaseModel):
    """登录用户修改密码请求。"""

    oldPassword: str | None = None
    newPassword: str | None = None


class ResetPasswordRequest(BaseModel):
    """管理员重置密码请求。"""

    username: str | None = None
    newPassword: str | None = None


class UserUpsertRequest(BaseModel):
    """管理员新增或修改账号请求。"""

    id: int | str | None = None
    username: str | None = None
    displayName: str | None = None
    password: str | None = None
    isAdmin: bool = False

