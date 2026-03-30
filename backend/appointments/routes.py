from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth.routes import get_current_user
from users.models import User
from .schemas import AppointmentOut, AppointmentCreate, AppointmentUpdate
from .crud import get_appointments, create_appointment, update_appointment, delete_appointment
from typing import Optional, List

router = APIRouter(
    prefix="/appointments", 
    tags=["appointments"])

@router.get("/", response_model=List[AppointmentOut])
def read_appointments(
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    status_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    filters = {"date_from": date_from, "date_to": date_to, "status_id": status_id}
    return get_appointments(db, current_user, filters)

@router.post("/", response_model=AppointmentOut, status_code=201)
def create_appointment_endpoint(
    appointment: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role_id not in [1, 2, 3]:
        raise HTTPException(403, "No autorizado")
    return create_appointment(db, appointment, current_user)

@router.put("/{id}", response_model=AppointmentOut)
def update_appointment_endpoint(
    id: int, data: AppointmentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return update_appointment(db, id, data, current_user)

@router.delete("/{id}")
def delete_appointment_endpoint(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return delete_appointment(db, id, current_user)