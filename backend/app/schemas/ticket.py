from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class TagBase(BaseModel):
    id: int
    name: str
    color: str
    
    model_config = ConfigDict(from_attributes=True)

class TicketBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None

class TicketCreate(TicketBase):
    tag_ids: Optional[List[int]] = []

class TicketUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    tag_ids: Optional[List[int]] = None

class TicketResponse(TicketBase):
    id: int
    is_completed: bool
    created_at: datetime
    updated_at: datetime
    tags: List[TagBase] = []
    
    model_config = ConfigDict(from_attributes=True)

class TicketListResponse(BaseModel):
    tickets: List[TicketResponse]
