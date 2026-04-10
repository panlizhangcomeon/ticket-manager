import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.main import app
from app.database import Base, get_db
from app.models import Ticket, Tag

# 使用内存数据库进行测试
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    """创建测试数据库会话"""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    """创建测试客户端"""
    def override_get_db():
        try:
            yield db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_tag(db):
    """创建示例标签"""
    tag = Tag(name="测试标签", color="#FF5733")
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag


@pytest.fixture
def sample_ticket(db, sample_tag):
    """创建示例Ticket"""
    ticket = Ticket(
        title="测试Ticket",
        description="这是一个测试Ticket",
        is_completed=False
    )
    ticket.tags.append(sample_tag)
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket
