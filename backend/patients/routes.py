from fastapi import Depends, APIRouter, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import exists
from database import get_db
from users import crud as user_crud
from doctors.crud import get_doctor_by_user_id
from appointments.models import Appointment
from patients.models import Patient                     
from .crud import (
    create_patient_with_user,
    get_patients,
    get_patient_by_id,
    update_patient,
    delete_patient,
    get_patient_by_user_id,
)
from .schemas import PatientCreate, PatientResponse, PatientUpdate
from typing import List
from auth.routes import get_current_user
from users.models import User
import logging

# Configurar logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/patients",
    tags=["patients"]
)

@router.post("/", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient_with_user_endpoint(
    patient_data: PatientCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role_id not in [1, 3]:
        raise HTTPException(status_code=403, detail="No autorizado")
    if user_crud.get_user_by_email(db, patient_data.email):
        raise HTTPException(status_code=400, detail="Email ya registrado")
    return create_patient_with_user(db, patient_data)

@router.get("/", response_model=List[PatientResponse])
def list_patients(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
):
    if current_user.role_id not in [1, 3]:
        raise HTTPException(status_code=403, detail="No autorizado")

    if current_user.role_id == 1:
        return get_patients(db, skip=skip, limit=limit)

    # Doctor → solo sus pacientes (con al menos una cita)
    doctor = get_doctor_by_user_id(db, current_user.id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Médico no encontrado")

    patients = (
        db.query(Patient)
        .options(joinedload(Patient.user))
        .join(Appointment, Appointment.patient_id == Patient.id)
        .filter(Appointment.doctor_id == doctor.id)
        .offset(skip)
        .limit(limit)
        .distinct()
        .all()
    )
    return patients

@router.get("/me", response_model=PatientResponse)
def read_current_patient(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    patient = get_patient_by_user_id(db, current_user.id)
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paciente no encontrado")
    return patient

@router.get("/{patient_id}", response_model=PatientResponse)
def read_patient(patient_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    patient = get_patient_by_id(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    # Admin siempre puede
    if current_user.role_id == 1:
        return patient

    # Paciente solo su propio perfil
    if current_user.role_id == 2 and patient.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="No autorizado")

    # Doctor solo si tiene cita con el paciente
    if current_user.role_id == 3:
        doctor = get_doctor_by_user_id(db, current_user.id)
        if not db.query(exists().where(
            Appointment.patient_id == patient_id,
            Appointment.doctor_id == doctor.id
        )).scalar():
            raise HTTPException(status_code=403, detail="No tienes permiso sobre este paciente")

    return patient

@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient_endpoint(
    patient_id: int,
    patient_update: PatientUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Admin, Doctor (si es suyo) y Paciente (solo propio)
    if current_user.role_id not in [1, 2, 3]:
        raise HTTPException(status_code=403, detail="No autorizado")

    patient = get_patient_by_id(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    # Paciente solo puede editar su propio perfil
    if current_user.role_id == 2 and patient.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="No tienes permiso")

    # Doctor solo puede editar pacientes con los que tiene cita
    if current_user.role_id == 3:
        doctor = get_doctor_by_user_id(db, current_user.id)
        if not db.query(exists().where(
            Appointment.patient_id == patient_id,
            Appointment.doctor_id == doctor.id
        )).scalar():
            raise HTTPException(status_code=403, detail="No tienes permiso sobre este paciente")

    return update_patient(db, patient_id, patient_update)

@router.delete("/{patient_id}")
def delete_patient_endpoint(
    patient_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Recomendación: solo Admin puede borrar pacientes (es peligroso)
    if current_user.role_id != 1:
        raise HTTPException(status_code=403, detail="No Autorizado, solo el administrador puede eliminar pacientes")

    patient = get_patient_by_id(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    delete_patient(db, patient_id)
    return {"message": "Paciente eliminado exitosamente"}