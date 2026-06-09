"""统一 JSON 错误响应，保证前端可以稳定读取 error 字段。"""

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


def setup_exception_handlers(app: FastAPI) -> None:
    """给 FastAPI 应用注册全局异常处理器。"""

    @app.exception_handler(ValueError)
    async def value_error_handler(request: Request, exc: ValueError) -> JSONResponse:
        """业务参数错误统一返回 400。"""
        del request
        return JSONResponse(status_code=400, content={"error": str(exc)})

    @app.exception_handler(PermissionError)
    async def permission_error_handler(request: Request, exc: PermissionError) -> JSONResponse:
        """权限错误统一返回 401。"""
        del request
        return JSONResponse(status_code=401, content={"error": str(exc)})

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
        """FastAPI/Starlette 抛出的 HTTP 异常统一转成 error 字段。"""
        del request
        return JSONResponse(status_code=exc.status_code, content={"error": str(exc.detail)})

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ) -> JSONResponse:
        """请求体或查询参数校验失败时返回详细字段错误。"""
        del request
        return JSONResponse(
            status_code=422,
            content={"error": "请求参数验证失败", "details": exc.errors()},
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        """兜底异常处理，避免服务端堆栈直接暴露给前端。"""
        del request
        return JSONResponse(status_code=500, content={"error": str(exc)})

