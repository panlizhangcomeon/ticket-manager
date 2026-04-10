#!/usr/bin/env bash
# 一键启动 ticket-manager 后端（8001）与前端（Vite 默认 5173）
# 不使用 set -u：venv 的 activate 在 nounset 下可能与部分环境不兼容，会误报「unbound variable」
set -eo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_FILE="$ROOT/.ticket-manager-dev.pids"
LOG_BACKEND="$ROOT/backend-dev.log"
LOG_FRONTEND="$ROOT/frontend-dev.log"

port_in_use() {
  lsof -ti ":$1" >/dev/null 2>&1
}

if port_in_use 8001; then
  echo "端口 8001 已被占用，请先执行 scripts/dev-stop.sh 或手动结束占用进程。"
  exit 1
fi
if port_in_use 5173; then
  echo "端口 5173 已被占用，请先执行 scripts/dev-stop.sh 或手动结束占用进程。"
  exit 1
fi

if [ -f "$PID_FILE" ]; then
  echo "发现遗留 PID 文件，正在尝试清理后启动…"
  "$ROOT/scripts/dev-stop.sh" || true
fi

# ---------- 后端 ----------
cd "$ROOT/backend"
if [ ! -d venv ] || [ ! -x venv/bin/python ]; then
  if command -v python3.13 >/dev/null 2>&1; then
    PY="python3.13"
  else
    PY="python3"
  fi
  echo "创建虚拟环境…"
  "$PY" -m venv venv
fi
# shellcheck source=/dev/null
source venv/bin/activate
if ! python -c "import fastapi" 2>/dev/null; then
  echo "安装后端依赖…"
  pip install -r requirements.txt
fi

echo "启动后端: http://localhost:8001 日志: ${LOG_BACKEND}"
nohup python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001 >>"${LOG_BACKEND}" 2>&1 &
BACK_PID=$!
echo "$BACK_PID" >"$PID_FILE"

# ---------- 前端 ----------
cd "$ROOT/frontend"
if [ ! -d node_modules ]; then
  echo "安装前端依赖…"
  npm install
fi

echo "启动前端: http://localhost:5173 日志: ${LOG_FRONTEND}"
nohup npm run dev >>"${LOG_FRONTEND}" 2>&1 &
FRONT_PID=$!
echo "$FRONT_PID" >>"$PID_FILE"

echo ""
echo "已后台启动。"
echo "  API:     http://localhost:8001/docs"
echo "  前端:    http://localhost:5173"
echo "  停止:    $ROOT/scripts/dev-stop.sh"
echo ""
