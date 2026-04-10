from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from app.database import engine, Base
from app.api.v1 import tickets, tags
from app.utils.errors import validation_exception_handler, sqlalchemy_exception_handler
# 导入模型以确保表被创建
from app.models import Ticket, Tag

# 创建数据库表（开发环境）
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Ticket Management System API",
    description="API for managing tickets and tags",
    version="1.0.0"
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite 默认端口
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册异常处理器
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)

# 注册路由
app.include_router(tickets.router, prefix="/api/v1/tickets", tags=["tickets"])
app.include_router(tags.router, prefix="/api/v1/tags", tags=["tags"])

@app.get("/")
async def root():
    return {"message": "Ticket Management System API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
