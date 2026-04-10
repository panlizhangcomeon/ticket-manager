#!/usr/bin/env bash
# 一键停止 ticket-manager 前后端（先读 PID 文件，再按端口 8001 / 5173 兜底）
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_FILE="$ROOT/.ticket-manager-dev.pids"

kill_port() {
  local port="$1"
  local pids
  pids=$(lsof -ti ":$port" 2>/dev/null || true)
  if [ -z "$pids" ]; then
    return 0
  fi
  # shellcheck disable=SC2086
  kill $pids 2>/dev/null || true
  sleep 0.4
  pids=$(lsof -ti ":$port" 2>/dev/null || true)
  if [ -n "$pids" ]; then
    # shellcheck disable=SC2086
    kill -9 $pids 2>/dev/null || true
  fi
}

if [ -f "$PID_FILE" ]; then
  while read -r pid; do
    [ -z "$pid" ] && continue
    kill "$pid" 2>/dev/null || true
  done <"$PID_FILE"
  rm -f "$PID_FILE"
fi

kill_port 8001
kill_port 5173

echo "已停止 ticket-manager 前后端（已释放端口 8001、5173）。"
