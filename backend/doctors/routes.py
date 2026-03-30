from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from users import crud as user_crud
from .crud import create_doctor_with_user, get_doctors, get_doctor_by_id, update_doctor, delete_doctor, get_doctor_by_user_id
from .schemas import DoctorCreate, DoctorResponse, DoctorUpdate
from typing import List
from auth.routes import get_current_user
from users.models import User
import logging

# Configurar logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/doctors",
    tags=["doctors"]
)

@router.post("/", response_model=DoctorResponse, status_code=status.HTTP_201_CREATED)
def create_doctor_with_user_endpoint(doctor_data: DoctorCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role_id != 1:
        raise HTTPException(status_code=403, detail="Not authorized")
    existing_user = user_crud.get_user_by_email(db, doctor_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    doctor = create_doctor_with_user(db, doctor_data)
    return doctor

@router.get("/", response_model=List[DoctorResponse])
def list_doctors(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role_id not in [1, 2, 3]:  # Permite admins, pacientes y doctores
        raise HTTPException(status_code=403, detail="Not authorized")
    return get_doctors(db)

@router.get("/{doctor_id}", response_model=DoctorResponse)
def read_doctor(doctor_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role_id not in [1, 3]:
        raise HTTPException(status_code=403, detail="Not authorized")
    if current_user.role_id == 3:
        current_doctor = get_doctor_by_user_id(db, user_id=current_user.id)
        if not current_doctor or current_doctor.id != doctor_id:
            raise HTTPException(status_code=403, detail="Not authorized to view this doctor's profile")
    db_doctor = get_doctor_by_id(db, doctor_id=doctor_id)
    if db_doctor is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    return db_doctor

@router.put("/{doctor_id}", response_model=DoctorResponse)
def update_doctor_endpoint(doctor_id: int, doctor_update: DoctorUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role_id not in [1, 3]:
        raise HTTPException(status_code=403, detail="Not authorized")
    logger.debug(f"Cuerpo de la solicitud PUT /doctors/{doctor_id}: {doctor_update.dict(exclude_unset=True)}")
    if current_user.role_id == 3:
        current_doctor = get_doctor_by_user_id(db, user_id=current_user.id)
        if not current_doctor or current_doctor.id != doctor_id:
            raise HTTPException(status_code=403, detail="Not authorized to update this doctor's profile")
    # Password update is handled securely - no logging of sensitive data
    updated_doctor = update_doctor(db, doctor_id=doctor_id, doctor_update=doctor_update)
    if updated_doctor is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    return updated_doctor

@router.delete("/{doctor_id}")
def delete_doctor_endpoint(doctor_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role_id != 1:
        raise HTTPException(status_code=403, detail="Not authorized")
    db_doctor = get_doctor_by_id(db, doctor_id=doctor_id)
    if db_doctor is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    delete_doctor(db, doctor_id=doctor_id)
    return {"message": "Doctor eliminado exitosamente"}

