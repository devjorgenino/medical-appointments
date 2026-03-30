from sqlalchemy.orm import Session, joinedload
from .models import Doctor
from .schemas import DoctorCreate, DoctorUpdate, DoctorResponse
from users.crud import create_user, update_user, get_user_by_email, delete_user
from users.schemas import UserCreate, UserUpdate
from users.models import User
import logging
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

# Configurar logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def get_doctor_by_id(db: Session, doctor_id: int):
    doctor = db.query(Doctor).options(joinedload(Doctor.user)).filter(Doctor.id == doctor_id).first()
    logger.debug(f"Buscando doctor ID {doctor_id}: {'Encontrado' if doctor else 'No encontrado'}")
    return doctor

def get_doctor_by_user_id(db: Session, user_id: int):
    doctor = db.query(Doctor).options(joinedload(Doctor.user)).filter(Doctor.user_id == user_id).first()
    logger.debug(f"Buscando doctor para usuario ID {user_id}: {'Encontrado' if doctor else 'No encontrado'}")
    return doctor

def get_doctors(db: Session, skip: int = 0, limit: int = 100):
    if limit > 1000:
        limit = 1000
    return db.query(Doctor).options(joinedload(Doctor.user)).offset(skip).limit(limit).all()

def create_doctor_with_user(db: Session, doctor_data: DoctorCreate):
    if doctor_data.role_id != 3:
        logger.error(f"Intento de crear doctor con role_id inválido: {doctor_data.role_id}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El role_id debe ser 3 para doctores")
    user_data = UserCreate(
        email=doctor_data.email,
        password=doctor_data.password,
        nombre=doctor_data.nombre,
        apellido=doctor_data.apellido,
        numero_telefono=doctor_data.numero_telefono,
        direccion=doctor_data.direccion,
        sexo=doctor_data.sexo,
        role_id=doctor_data.role_id
    )
    user = create_user(db, user_data)
    
    doctor = Doctor(
        user_id=user.id,
        especialidad=doctor_data.especialidad
    )
    db.add(doctor)
    try:
        db.commit()
        db.refresh(doctor)
        logger.debug(f"Doctor creado con ID {doctor.id} para usuario ID {user.id}")
        return doctor
    except IntegrityError:
        db.rollback()
        logger.error(f"Error de integridad al crear doctor para usuario ID {user.id}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear el doctor, verifica los datos")

def create_doctor(db: Session, doctor_data: dict):
    db_doctor = Doctor(**doctor_data)
    db.add(db_doctor)
    try:
        db.commit()
        db.refresh(db_doctor)
        logger.debug(f"Doctor creado con ID {db_doctor.id}")
        return db_doctor
    except IntegrityError:
        db.rollback()
        logger.error(f"Error de integridad al crear doctor con datos {doctor_data}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear el doctor, verifica los datos")

def update_doctor(db: Session, doctor_id: int, doctor_update: DoctorUpdate):
    db_doctor = get_doctor_by_id(db, doctor_id)
    if not db_doctor:
        logger.error(f"Doctor con ID {doctor_id} no encontrado")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor no encontrado")

    update_data = doctor_update.dict(exclude_unset=True)
    logger.debug(f"Datos de actualización recibidos para doctor ID {doctor_id}: {update_data}")
    
    has_changes = False
    if 'especialidad' in update_data:
        db_doctor.especialidad = update_data.pop('especialidad')
        has_changes = True
        logger.debug(f"Especialidad actualizada para doctor ID {doctor_id}: {db_doctor.especialidad}")

    user_update_dict = {k: v for k, v in update_data.items()}
    if user_update_dict:
        user_update_data = UserUpdate(**user_update_dict)
        updated_user, user_changed = update_user(db, db_doctor.user_id, user_update_data)
        if not updated_user:
            logger.error(f"No se pudo actualizar el usuario con ID {db_doctor.user_id}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error al actualizar el usuario asociado")
        if user_changed:
            has_changes = True
            logger.debug(f"Usuario ID {db_doctor.user_id} actualizado correctamente")

    if not has_changes:
        logger.debug(f"No hay datos para actualizar en doctor ID {doctor_id} ni en su usuario asociado")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No hay datos para actualizar"
        )

    try:
        db.commit()
        db.refresh(db_doctor)
        logger.debug(f"Doctor ID {doctor_id} actualizado correctamente")
        return db_doctor
    except IntegrityError:
        db.rollback()
        logger.error(f"Error de integridad al actualizar doctor ID {doctor_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado o los datos son inválidos"
        )

def delete_doctor(db: Session, doctor_id: int) -> bool:
    db_doctor = get_doctor_by_id(db, doctor_id)
    if db_doctor:
        user_id = db_doctor.user_id
        db.delete(db_doctor)
        try:
            db.commit()
            logger.debug(f"Doctor ID {doctor_id} eliminado correctamente")
            delete_user(db, user_id)
            return True
        except IntegrityError:
            db.rollback()
            logger.error(f"Error de integridad al eliminar doctor ID {doctor_id}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se pudo eliminar el doctor debido a dependencias")
    return False