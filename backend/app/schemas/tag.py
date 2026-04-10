from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class TagBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    color: Optional[str] = Field(None, pattern=r'^#[0-9A-Fa-f]{6}$')

class TagCreate(TagBase):
    pass

class TagUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    color: Optional[str] = Field(None, pattern=r'^#[0-9A-Fa-f]{6}$')

class TagResponse(TagBase):
    id: int
    sort_order: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TagReorderRequest(BaseModel):
    """按数组顺序写入 sort_order（须包含全部标签 id，各出现一次）"""

    tag_ids: List[int] = Field(..., min_length=1)


class TagListResponse(BaseModel):
    tags: List[TagResponse]
