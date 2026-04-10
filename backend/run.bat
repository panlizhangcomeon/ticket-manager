@echo off
REM Ticket Management System - Backend 启动脚本 (Windows)

REM 切换到脚本所在目录
cd /d "%~dp0"

REM 检查虚拟环境是否存在
if not exist "venv" (
    echo 虚拟环境不存在，正在创建...
    python -m venv venv
)

REM 激活虚拟环境
echo 激活虚拟环境...
call venv\Scripts\activate.bat

REM 检查依赖是否已安装
python -c "import fastapi" 2>nul
if errorlevel 1 (
    echo 依赖未安装，正在安装...
    pip install -r requirements.txt
)

REM 运行服务
echo 启动 FastAPI 服务...
echo 服务地址: http://localhost:8001
echo API 文档: http://localhost:8001/docs
echo.
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
