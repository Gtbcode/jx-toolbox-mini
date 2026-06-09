# Personal Toolbox

个人工具合集已经按平台化方式重构：根目录统一启动，后端采用 `backend/app` 分层，前端静态资源放在 `ui`。旧的 `http.server` 入口和 `/api` 兼容路径已经移除，前后端统一使用 `/api/v2`。

## 当前工具

- 体重趋势：目标体重、身高、性别、每日体重记录、趋势图、DeepSeek 明日分析（后端限流）。
- PDF 处理：三栏工作台，支持 PDF 上传、水印、遮盖打码、本地预览与导出，配置按账号保存（`pdf-processing`）。
- 图片编辑：三栏工作台，支持裁剪、尺寸调整、压缩、格式转换、调色、水印、隐私打码，本地预览与导出，配置按账号保存（`image-processing`）。
- 账号管理：管理员创建、修改、删除账号；所有用户可修改自己的密码。

## 项目结构

```text
personal-toolbox/
  pyproject.toml
  start_server.py              # 根目录统一启动入口
  ui/                          # 静态前端资源
    index.html
    app.js
    styles.css
    favicon.svg
  backend/
    requirements.txt
    .env.example
    app/
      main.py                  # FastAPI 应用入口
      api/
        __init__.py            # 只注册 /api/v2
        deps.py                # 登录态、管理员权限依赖
        v2/
          auth.py
          users.py
          weight.py
          tool_settings.py
          deepseek.py
      config/
        settings.py            # 环境变量和路径配置
        database.py            # PostgreSQL 连接与 SQL 执行
      middleware/
        error_handler.py       # 统一 JSON 错误响应
      services/
        auth_service.py
        database_service.py
        tool_settings_service.py
      tools/
        storage.py
        weight.py
        watermark.py
        image_mosaic.py
        deepseek.py
      schemas/
      models/
      repositories/
      utils/
```

## API 约定

所有前端请求统一走正式版本路径：

```text
/api/v2/*
```

不再保留旧的 `/api/*` 兼容接口。

## 环境变量

复制 `backend/.env.example` 到 `backend/.env`，按需调整：

```env
PGHOST=127.0.0.1
PGPORT=5432
PGUSER=postgres
PGPASSWORD=你的数据库密码
PGDATABASE=personal_toolbox
DEEPSEEK_API_KEY=你的 DeepSeek API Key
DEEPSEEK_MODEL=deepseek-v4-flash
PORT=5173
APP_HOST=127.0.0.1
APP_DEBUG=false
```

## 启动

```powershell
cd E:\Projects\myproject\personal-toolbox
pip install -r backend\requirements.txt
python start_server.py
```

浏览器打开：

```text
http://127.0.0.1:5173
```

API 文档：

```text
http://127.0.0.1:5173/docs
```

## 新增工具方式

1. 在 `backend/app/tools/` 新增工具模块，放业务函数和表初始化。
2. 如果需要初始化数据库表，在 `backend/app/tools/__init__.py` 的 `init_tables()` 里调用。
3. 在 `backend/app/services/` 新增服务层，负责工具编排和权限后的业务动作。
4. 在 `backend/app/api/v2/` 新增路由文件，只处理 HTTP 入参和响应。
5. 在 `backend/app/api/v2/__init__.py` 注册新路由。
6. 前端资源放在 `ui/`，统一通过 `/api/v2` 调用后端。

