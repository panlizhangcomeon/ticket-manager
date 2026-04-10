# Ticket 管理系统

## 项目简介

一个简单、轻量级的 Ticket 管理系统，支持通过标签对 Ticket 进行分类和管理。系统采用前后端分离架构，无需用户认证系统，专注于核心的 Ticket 和标签管理功能。

## 技术栈

**后端：**

- FastAPI：Python 异步 Web 框架
- MySQL：关系型数据库
- SQLAlchemy：ORM 框架

**前端：**

- React 19 + TypeScript：UI 框架
- Vite：快速的前端构建工具
- Tailwind CSS：实用优先的 CSS 框架
- Shadcn UI：基于 Radix UI 和 Tailwind 的组件库
- React Query：数据获取和状态管理

## 项目结构

```
ticket-manager/
├── backend/              # 后端项目
│   ├── app/             # 应用代码
│   ├── tests/           # 测试文件
│   ├── migrations/      # 数据库迁移
│   └── requirements.txt  # Python 依赖
├── frontend/            # 前端项目
│   ├── src/             # 源代码
│   └── package.json     # Node.js 依赖
└── docs/                # 文档目录
```

## 快速开始

### 1. 数据库初始化

确保 MySQL 服务已启动，然后执行：

```bash
mysql -u root -p < backend/init_db.sql
```

或者手动执行 SQL 文件中的语句。

### 2. 后端启动

```bash
cd backend

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量（可选，默认值已配置）
cp .env.example .env

# 运行服务（方式一：使用启动脚本）
./run.sh

# 或者方式二：手动运行（确保在 backend 目录下）
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

后端服务将在 `http://localhost:8001` 启动。

### 3. 前端启动

```bash
cd frontend

# 安装依赖
npm install

# 配置环境变量（可选，默认值已配置）
cp .env.example .env

# 开发模式运行
npm run dev
```

前端应用将在 `http://localhost:5173` 启动。

## API 文档

后端启动后，可以访问：

- Swagger UI: [http://localhost:8001/docs](http://localhost:8001/docs)
- ReDoc: [http://localhost:8001/redoc](http://localhost:8001/redoc)

## 测试

### 后端测试

```bash
cd backend

# 运行所有测试
./run_tests.sh

# 或手动运行
pytest app/tests/ -v

# 查看测试覆盖率
pytest app/tests/ --cov=app --cov-report=term-missing
```

详细测试说明请参考 [backend/README_TESTING.md](./backend/README_TESTING.md)

## 开发阶段

### 阶段 1：项目初始化和环境搭建 ✅

- 创建项目目录结构
- 初始化后端项目
- 初始化前端项目
- 数据库初始化

### 阶段 2：后端开发（待完成）

- 数据库模型实现
- Pydantic 模式实现
- CRUD 操作实现
- API 路由实现
- 错误处理和工具函数

### 阶段 3：前端开发（待完成）

- 类型定义和 API 服务
- React Query Hooks
- UI 组件实现
- 页面组件实现

### 阶段 4：测试和优化 ✅

- 后端 API 测试（pytest）
- 性能优化（代码分割、查询优化）
- UI/UX 优化（Toast 通知、骨架屏）
- Bug 修复和代码审查

## 环境变量配置

### 后端 (.env)

```env
DATABASE_HOST=localhost
DATABASE_PORT=3307
DATABASE_USER=root
DATABASE_PASSWORD=123456
DATABASE_NAME=ticket_db
```

### 前端 (.env)

```env
VITE_API_BASE_URL=http://localhost:8001
```

## 参考文档

- [需求文档](./docs/0001-spec.md)
- [实现计划](./docs/0001-plan.md)

## 许可证

MIT