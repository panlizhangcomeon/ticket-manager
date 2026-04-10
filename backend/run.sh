#!/bin/bash

# Ticket Management System - Backend 启动脚本

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 优先 python3.13（wheel 齐全）；否则 python3。勿在路径中含多余空格的项目目录外复制 venv，否则会损坏 shebang。
if command -v python3.13 >/dev/null 2>&1; then
    PY="python3.13"
else
    PY="python3"
fi

# 检查虚拟环境是否存在；解释器不可执行则重建（修复损坏的 venv）
if [ ! -d "venv" ] || [ ! -x "venv/bin/python" ]; then
    echo "虚拟环境不存在或已损坏，正在创建..."
    rm -rf venv
    "$PY" -m venv venv
fi

# 激活虚拟环境
echo "激活虚拟环境..."
source venv/bin/activate

# 检查依赖是否已安装
if ! python -c "import fastapi" 2>/dev/null; then
    echo "依赖未安装，正在安装..."
    pip install -r requirements.txt
fi

# 运行服务
echo "启动 FastAPI 服务..."
echo "服务地址: http://localhost:8001"
echo "API 文档: http://localhost:8001/docs"
echo ""
# 使用模块方式启动，避免 venv/bin/uvicorn 内错误 shebang（如路径中被插入空格）导致无法执行
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
