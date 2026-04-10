from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.crud import ticket as ticket_crud
from app.schemas.ticket import TicketCreate, TicketUpdate, TicketResponse, TicketListResponse

router = APIRouter()

@router.get("/", response_model=TicketListResponse)
def get_tickets(
    include_completed: bool = Query(True, description="是否包含已完成的 Ticket"),
    tag_id: Optional[int] = Query(None, description="按标签过滤"),
    keyword: Optional[str] = Query(None, description="按标题搜索"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    tickets = ticket_crud.get_tickets(
        db, skip=skip, limit=limit,
        include_completed=include_completed,
        tag_id=tag_id,
        keyword=keyword
    )
    return TicketListResponse(tickets=[TicketResponse.model_validate(t) for t in tickets])

@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = ticket_crud.get_ticket(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return TicketResponse.model_validate(ticket)

@router.post("/", response_model=TicketResponse, status_code=201)
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    return TicketResponse.model_validate(ticket_crud.create_ticket(db, ticket, ticket.tag_ids))

@router.put("/{ticket_id}", response_model=TicketResponse)
def update_ticket(ticket_id: int, ticket_update: TicketUpdate, db: Session = Depends(get_db)):
    ticket = ticket_crud.update_ticket(db, ticket_id, ticket_update)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return TicketResponse.model_validate(ticket)

@router.delete("/{ticket_id}", status_code=204)
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    if not ticket_crud.delete_ticket(db, ticket_id):
        raise HTTPException(status_code=404, detail="Ticket not found")
    return None

@router.patch("/{ticket_id}/complete", response_model=TicketResponse)
def complete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = ticket_crud.toggle_complete(db, ticket_id, True)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return TicketResponse.model_validate(ticket)

@router.patch("/{ticket_id}/uncomplete", response_model=TicketResponse)
def uncomplete_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = ticket_crud.toggle_complete(db, ticket_id, False)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return TicketResponse.model_validate(ticket)
