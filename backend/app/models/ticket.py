from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Table, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

# 关联表
ticket_tags = Table(
    'ticket_tags',
    Base.metadata,
    Column('id', Integer, primary_key=True, index=True),
    Column('ticket_id', Integer, ForeignKey('tickets.id', ondelete='CASCADE'), nullable=False),
    Column('tag_id', Integer, ForeignKey('tags.id', ondelete='CASCADE'), nullable=False),
    Column('created_at', DateTime(timezone=True), server_default=func.now()),
    extend_existing=True
)

class Ticket(Base):
    __tablename__ = "tickets"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    is_completed = Column(Boolean, default=False, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # 关联关系
    tags = relationship("Tag", secondary=ticket_tags, back_populates="tickets")
