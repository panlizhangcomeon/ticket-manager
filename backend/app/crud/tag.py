from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.models.tag import Tag
from app.schemas.tag import TagCreate, TagUpdate

def get_tag(db: Session, tag_id: int) -> Optional[Tag]:
    return db.query(Tag).filter(Tag.id == tag_id).first()

def get_tags(db: Session, skip: int = 0, limit: int = 100) -> List[Tag]:
    return (
        db.query(Tag)
        .order_by(Tag.sort_order.asc(), Tag.id.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )

def create_tag(db: Session, tag: TagCreate) -> Tag:
    max_order = db.query(func.max(Tag.sort_order)).scalar()
    next_order = (max_order if max_order is not None else -1) + 1
    db_tag = Tag(
        name=tag.name,
        color=tag.color or '#3B82F6',
        sort_order=next_order,
    )
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag

def update_tag(db: Session, tag_id: int, tag_update: TagUpdate) -> Optional[Tag]:
    db_tag = get_tag(db, tag_id)
    if not db_tag:
        return None
    
    if tag_update.name is not None:
        db_tag.name = tag_update.name
    if tag_update.color is not None:
        db_tag.color = tag_update.color
    
    db.commit()
    db.refresh(db_tag)
    return db_tag

def delete_tag(db: Session, tag_id: int) -> bool:
    db_tag = get_tag(db, tag_id)
    if not db_tag:
        return False
    db.delete(db_tag)
    db.commit()
    return True


def reorder_tags(db: Session, tag_ids: List[int]) -> Optional[List[Tag]]:
    all_tags = db.query(Tag).all()
    all_ids = {t.id for t in all_tags}
    if len(tag_ids) != len(all_ids) or set(tag_ids) != all_ids:
        return None
    for order, tid in enumerate(tag_ids):
        row = get_tag(db, tid)
        if row is None:
            return None
        row.sort_order = order
    db.commit()
    return get_tags(db, skip=0, limit=1000)
