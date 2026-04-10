# Ticket Management System - Frontend

## 项目简介

基于 React + TypeScript + Vite 的 Ticket 管理系统前端应用。

## 环境要求

- Node.js 18+
- npm 或 yarn

## 安装和运行

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并修改 API 地址：

```bash
cp .env.example .env
```

### 3. 开发模式运行

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

### 4. 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

## 项目结构

```
frontend/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── ui/             # Shadcn UI 组件
│   │   ├── TicketCard.tsx  # Ticket 卡片组件
│   │   ├── TicketForm.tsx  # Ticket 表单组件
│   │   └── ...
│   ├── pages/              # 页面组件
│   │   ├── TicketList.tsx  # Ticket 列表页
│   │   └── TagManager.tsx  # 标签管理页
│   ├── hooks/              # 自定义 Hooks
│   │   ├── useTickets.ts   # Ticket 相关逻辑
│   │   └── useTags.ts      # 标签相关逻辑
│   ├── services/           # API 服务
│   │   ├── api.ts          # API 客户端配置
│   │   ├── tickets.ts      # Ticket API
│   │   └── tags.ts         # 标签 API
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   ├── lib/                # 第三方库配置
│   ├── App.tsx             # 根组件
│   ├── main.tsx            # 入口文件
│   └── index.css           # 全局样式
├── public/                 # 静态资源
├── index.html              # HTML 模板
├── package.json            # 依赖配置
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 配置
├── tailwind.config.js      # Tailwind 配置
├── postcss.config.js       # PostCSS 配置
├── .env                    # 环境变量
└── README.md               # 说明文档
```

## 技术栈

- **React 19**: UI 框架
- **TypeScript**: 类型安全
- **Vite**: 构建工具
- **Tailwind CSS**: 样式框架
- **Shadcn UI**: UI 组件库
- **React Query**: 数据获取和状态管理
- **Axios**: HTTP 客户端
