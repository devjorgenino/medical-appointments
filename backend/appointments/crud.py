from sqlalchemy.orm import Session, joinedload
from .models import Appointment as AppointmentModel, AppointmentStatus
from .schemas import AppointmentCreate, AppointmentOut, AppointmentUpdate
from doctors.crud import get_doctor_by_id, get_doctor_by_user_id
from patients.crud import get_patient_by_id, get_patient_by_user_id
from schedules.crud import get_timeslot_by_id
from doctors.models import Doctor
from patients.models import Patient
from fastapi import HTTPException
from datetime import datetime, time
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
import logging

logger = logging.getLogger(__name__)

def get_appointment_status_by_name(db: Session, name: str):
    return db.query(AppointmentStatus).filter(AppointmentStatus.name == name).first()

def get_appointments(db: Session, current_user, filters: dict = {}):
    query = db.query(AppointmentModel).options(
        joinedload(AppointmentModel.doctor).joinedload(Doctor.user),  
        joinedload(AppointmentModel.patient).joinedload(Patient.user),  
        joinedload(AppointmentModel.time_slot),
        joinedload(AppointmentModel.status)
    )
    
    # Filtrar por role
    if current_user.role_id == 1:  # Admin: todas
        pass
    elif current_user.role_id == 2:  # Paciente: solo suyas
        patient = get_patient_by_user_id(db, current_user.id)
        if not patient:
            raise HTTPException(404, "Paciente no encontrado")
        query = query.filter(AppointmentModel.patient_id == patient.id)
    elif current_user.role_id == 3:  # Médico: solo las suyas
        doctor = get_doctor_by_user_id(db, current_user.id)
        if not doctor:
            raise HTTPException(404, "Médico no encontrado")
        query = query.filter(AppointmentModel.doctor_id == doctor.id)
    else:
        raise HTTPException(403, "No autorizado")
    
    # Aplicar filtros
    if filters.get('date_from'):
        query = query.filter(AppointmentModel.date >= datetime.fromisoformat(filters['date_from']))
    if filters.get('date_to'):
        query = query.filter(AppointmentModel.date <= datetime.fromisoformat(filters['date_to']))
    if filters.get('status_id'):
        query = query.filter(AppointmentModel.status_id == filters['status_id'])
    
    appointments = query.all()
    valid_appointments = []
    for app in appointments:
        if not (app.doctor and app.doctor.user):
            logger.warning(f"Appointment {app.id} missing doctor.user - Skipping")
            continue
        if not (app.patient and app.patient.user):
            logger.warning(f"Appointment {app.id} missing patient.user - Skipping")
            continue
        logger.debug(f"Appointment {app.id}: Doctor user {app.doctor.user.id}, Patient user {app.patient.user.id}")
        valid_appointments.append(app)
    
    return [AppointmentOut.from_orm(app) for app in valid_appointments]

def create_appointment(db: Session, appointment: AppointmentCreate, current_user):
    # Validar autorización basada en role
    if current_user.role_id not in [1, 2, 3]:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    # Obtener entidades relacionadas
    doctor = get_doctor_by_id(db, appointment.doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    
    patient = get_patient_by_id(db, appointment.patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Validar que el usuario actual tenga permiso para crear esta cita
    if current_user.role_id == 2:  # Paciente: solo para sí mismo
        current_patient = get_patient_by_user_id(db, current_user.id)
        if current_patient.id != appointment.patient_id:
            raise HTTPException(status_code=403, detail="Solo puedes crear citas para ti mismo")
    elif current_user.role_id == 3:  # Doctor: solo para sí mismo
        current_doctor = get_doctor_by_user_id(db, current_user.id)
        if current_doctor.id != appointment.doctor_id:
            raise HTTPException(status_code=403, detail="Solo puedes crear citas para ti mismo")
    # Admin (1) puede crear para cualquiera
    
    # Obtener el time slot y validar
    timeslot = get_timeslot_by_id(db, appointment.time_slot_id)
    if not timeslot or not timeslot.is_active:
        raise HTTPException(status_code=404, detail="Time slot no encontrado o no activo")
    
    if timeslot.schedule.doctor_id != appointment.doctor_id:
        raise HTTPException(status_code=400, detail="El time slot no pertenece al médico seleccionado")
    
    # Corregir si start_time es time object: Convertir a str
    start_time_str = timeslot.start_time.isoformat() if isinstance(timeslot.start_time, time) else timeslot.start_time
    end_time_str = timeslot.end_time.isoformat() if isinstance(timeslot.end_time, time) else timeslot.end_time
    
    # Crear datetime completo para la cita
    appointment_datetime = datetime.combine(appointment.date.date(), time.fromisoformat(start_time_str))
    appointment_end = datetime.combine(appointment.date.date(), time.fromisoformat(end_time_str))
    
    # Validar que la fecha sea futura
    if appointment_datetime <= datetime.now():
        raise HTTPException(status_code=400, detail="La fecha de la cita debe ser futura")
    
    # Chequear superposiciones (disponibilidad)
    overlapping = db.query(AppointmentModel).filter(
        AppointmentModel.doctor_id == appointment.doctor_id,
        AppointmentModel.date >= appointment_datetime,
        AppointmentModel.date < appointment_end,
        AppointmentModel.status_id != 2  # Excluir canceladas (ID 2 = "Cancelada")
    ).first()
    if overlapping:
        raise HTTPException(status_code=400, detail="El horario ya está ocupado")
    
    # Generar código único (e.g., "ZY-00001")
    max_id = db.query(func.max(AppointmentModel.id)).scalar() or 0
    code = f"ZY-{str(max_id + 1).zfill(5)}"
    
    # Obtener status inicial ("Pendiente")
    initial_status = get_appointment_status_by_name(db, "Pendiente")
    if not initial_status:
        raise HTTPException(status_code=500, detail="Status inicial no encontrado")
    
    # Crear la cita
    db_appointment = AppointmentModel(
        code=code,
        type=appointment.type,
        doctor_id=appointment.doctor_id,
        patient_id=appointment.patient_id,
        time_slot_id=appointment.time_slot_id,
        date=appointment_datetime,
        cost=appointment.cost or 0.0,
        notes=appointment.notes,
        status_id=initial_status.id,
        is_paid=False
    )
    
    db.add(db_appointment)
    try:
        db.commit()
        db.refresh(db_appointment)
        logger.debug(f"Cita creada con ID {db_appointment.id} y código {code}")
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error de integridad: código duplicado o datos inválidos")
    
    # Retornar con relaciones cargadas para AppointmentOut
    loaded_appointment = db.query(AppointmentModel).options(
        joinedload(AppointmentModel.doctor).joinedload(Doctor.user),
        joinedload(AppointmentModel.patient).joinedload(Patient.user),
        joinedload(AppointmentModel.time_slot),
        joinedload(AppointmentModel.status)
    ).filter(AppointmentModel.id == db_appointment.id).first()
    
    return AppointmentOut.from_orm(loaded_appointment)

def update_appointment(db: Session, id: int, data: AppointmentUpdate, current_user):
    app = db.query(AppointmentModel).filter(AppointmentModel.id == id).first()
    if not app:
        raise HTTPException(404, "Cita no encontrada")
    
    if current_user.role_id == 1:
        pass
    elif current_user.role_id == 2:
        if app.patient_id != get_patient_by_user_id(db, current_user.id).id:
            raise HTTPException(403, "No autorizado")
    elif current_user.role_id == 3:
        if app.doctor_id != get_doctor_by_user_id(db, current_user.id).id:
            raise HTTPException(403, "No autorizado")
    
    for field, value in data.dict(exclude_unset=True).items():
        setattr(app, field, value)
    db.commit()
    db.refresh(app)
    # Recarga con relaciones para AppointmentOut
    app = db.query(AppointmentModel).options(
        joinedload(AppointmentModel.doctor).joinedload(Doctor.user),  
        joinedload(AppointmentModel.patient).joinedload(Patient.user),  
        joinedload(AppointmentModel.time_slot),
        joinedload(AppointmentModel.status)
    ).filter(AppointmentModel.id == id).first()
    return AppointmentOut.from_orm(app)

def delete_appointment(db: Session, id: int, current_user):
    app = db.query(AppointmentModel).filter(AppointmentModel.id == id).first()
    if not app:
        raise HTTPException(404, "Cita no encontrada")
    
    if current_user.role_id == 1:
        pass
    elif current_user.role_id == 2:
        if app.patient_id != get_patient_by_user_id(db, current_user.id).id:
            raise HTTPException(403, "No autorizado")
    elif current_user.role_id == 3:
        if app.doctor_id != get_doctor_by_user_id(db, current_user.id).id:
            raise HTTPException(403, "No autorizado")
    
    app.status_id = 2  # Asumiendo que ID 2 es "Cancelada"
    db.commit()
    return {"message": "Cita cancelada"}