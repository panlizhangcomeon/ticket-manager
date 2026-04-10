from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import tag as tag_crud
from app.schemas.tag import TagCreate, TagUpdate, TagResponse, TagListResponse, TagReorderRequest

router = APIRouter()


@router.put("/reorder", response_model=TagListResponse)
def reorder_tags(body: TagReorderRequest, db: Session = Depends(get_db)):
    result = tag_crud.reorder_tags(db, body.tag_ids)
    if result is None:
        raise HTTPException(
            status_code=400,
            detail="tag_ids 必须包含当前全部标签且各出现一次",
        )
    return TagListResponse(tags=[TagResponse.model_validate(t) for t in result])


@router.get("/", response_model=TagListResponse)
def get_tags(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    tags = tag_crud.get_tags(db, skip=skip, limit=limit)
    return TagListResponse(tags=[TagResponse.model_validate(t) for t in tags])

@router.get("/{tag_id}", response_model=TagResponse)
def get_tag(tag_id: int, db: Session = Depends(get_db)):
    tag = tag_crud.get_tag(db, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return TagResponse.model_validate(tag)

@router.post("/", response_model=TagResponse, status_code=201)
def create_tag(tag: TagCreate, db: Session = Depends(get_db)):
    return TagResponse.model_validate(tag_crud.create_tag(db, tag))

@router.put("/{tag_id}", response_model=TagResponse)
def update_tag(tag_id: int, tag_update: TagUpdate, db: Session = Depends(get_db)):
    tag = tag_crud.update_tag(db, tag_id, tag_update)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return TagResponse.model_validate(tag)

@router.delete("/{tag_id}", status_code=204)
def delete_tag(tag_id: int, db: Session = Depends(get_db)):
    if not tag_crud.delete_tag(db, tag_id):
        raise HTTPException(status_code=404, detail="Tag not found")
    return None
