# Ticket Management System - Backend

## 项目简介

基于 FastAPI 的 Ticket 管理系统后端 API。

## 环境要求

- Python 3.8+
- MySQL 5.7+ 或 MySQL 8.0+

## 安装和运行

### 1. 创建虚拟环境

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env` 并修改数据库配置：

```bash
cp .env.example .env
```

### 4. 创建数据库

确保 MySQL 服务已启动，然后创建数据库：

```sql
CREATE DATABASE IF NOT EXISTS ticket_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. 运行服务

**重要：** 必须在 `backend` 目录下运行命令，并且确保已激活虚拟环境。

**方式一：使用启动脚本（推荐）**

```bash
cd backend
./run.sh
```

**方式二：手动运行**

```bash
cd backend
source venv/bin/activate  # 确保激活虚拟环境
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

**如果遇到 `ModuleNotFoundError: No module named 'app'` 错误：**

1. 确保当前目录是 `backend` 目录（运行 `pwd` 确认）
2. 确保已激活虚拟环境（运行 `which python` 应该显示 venv 路径）
3. 确保在 `backend` 目录下有 `app` 文件夹

服务将在 `http://localhost:8001` 启动。

### 6. 访问 API 文档

- Swagger UI: http://localhost:8001/docs
- ReDoc: http://localhost:8001/redoc

## 故障排除

### 问题：`ModuleNotFoundError: No module named 'app'`

**原因：** 不在正确的目录下运行，或未激活虚拟环境。

**解决方案：**

1. **确认当前目录：**
   ```bash
   pwd  # 应该显示 .../ticket-manager/backend
   ```

2. **确认虚拟环境已激活：**
   ```bash
   which python  # macOS/Linux: 应该显示 .../backend/venv/bin/python
   # 或
   where python  # Windows: 应该显示 ...\backend\venv\Scripts\python.exe
   ```

3. **如果未激活，手动激活：**
   ```bash
   # macOS/Linux
   source venv/bin/activate
   
   # Windows
   venv\Scripts\activate
   ```

4. **使用启动脚本（最简单）：**
   ```bash
   # macOS/Linux
   ./run.sh
   
   # Windows
   run.bat
   ```

### 问题：数据库连接失败

检查 `.env` 文件中的数据库配置是否正确，确保 MySQL 服务已启动。

## 项目结构

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI 应用入口
│   ├── config.py            # 配置管理
│   ├── database.py          # 数据库连接和会话管理
│   ├── models/              # SQLAlchemy 模型
│   ├── schemas/             # Pydantic 模式
│   ├── api/                 # API 路由
│   │   └── v1/
│   ├── crud/                # CRUD 操作
│   └── utils/               # 工具函数
├── tests/                   # 测试文件
├── migrations/              # 数据库迁移（可选）
├── requirements.txt         # Python 依赖
├── .env                     # 环境变量（不提交到版本控制）
├── .env.example             # 环境变量示例
└── README.md                # 说明文档
```
