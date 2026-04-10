from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List, Optional
from app.models.ticket import Ticket, ticket_tags
from app.models.tag import Tag
from app.schemas.ticket import TicketCreate, TicketUpdate

def get_ticket(db: Session, ticket_id: int) -> Optional[Ticket]:
    return db.query(Ticket).options(joinedload(Ticket.tags)).filter(Ticket.id == ticket_id).first()

def get_tickets(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    include_completed: bool = True,
    tag_id: Optional[int] = None,
    keyword: Optional[str] = None
) -> List[Ticket]:
    # 构建基础查询，始终预加载 tags 以避免 N+1 查询问题
    query = db.query(Ticket).options(joinedload(Ticket.tags))
    
    # 如果使用 tag_id 过滤，使用 JOIN 优化查询
    if tag_id:
        query = query.join(ticket_tags).filter(ticket_tags.c.tag_id == tag_id).distinct()
    
    if not include_completed:
        query = query.filter(Ticket.is_completed == False)
    
    if keyword:
        # MySQL 使用 LIKE 进行模糊搜索，使用 LOWER 实现不区分大小写
        query = query.filter(func.lower(Ticket.title).like(f"%{keyword.lower()}%"))
    
    return query.offset(skip).limit(limit).all()

def create_ticket(db: Session, ticket: TicketCreate, tag_ids: Optional[List[int]] = None) -> Ticket:
    db_ticket = Ticket(
        title=ticket.title,
        description=ticket.description,
        is_completed=False
    )
    
    if tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(tag_ids)).all()
        db_ticket.tags = tags
    
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def update_ticket(db: Session, ticket_id: int, ticket_update: TicketUpdate) -> Optional[Ticket]:
    db_ticket = get_ticket(db, ticket_id)
    if not db_ticket:
        return None
    
    if ticket_update.title is not None:
        db_ticket.title = ticket_update.title
    if ticket_update.description is not None:
        db_ticket.description = ticket_update.description
    if ticket_update.tag_ids is not None:
        tags = db.query(Tag).filter(Tag.id.in_(ticket_update.tag_ids)).all()
        db_ticket.tags = tags
    
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def delete_ticket(db: Session, ticket_id: int) -> bool:
    db_ticket = get_ticket(db, ticket_id)
    if not db_ticket:
        return False
    db.delete(db_ticket)
    db.commit()
    return True

def toggle_complete(db: Session, ticket_id: int, is_completed: bool) -> Optional[Ticket]:
    db_ticket = get_ticket(db, ticket_id)
    if not db_ticket:
        return None
    db_ticket.is_completed = is_completed
    db.commit()
    db.refresh(db_ticket)
    return db_ticket
