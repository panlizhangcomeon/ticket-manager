from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.tag import Tag
from app.schemas.tag import TagCreate, TagUpdate

def get_tag(db: Session, tag_id: int) -> Optional[Tag]:
    return db.query(Tag).filter(Tag.id == tag_id).first()

def get_tags(db: Session, skip: int = 0, limit: int = 100) -> List[Tag]:
    return db.query(Tag).offset(skip).limit(limit).all()

def create_tag(db: Session, tag: TagCreate) -> Tag:
    db_tag = Tag(
        name=tag.name,
        color=tag.color or '#3B82F6'
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
