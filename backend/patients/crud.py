from sqlalchemy.orm import Session, joinedload
from .models import Patient
from .schemas import PatientCreate, PatientUpdate, PatientResponse
from users.crud import create_user, update_user, get_user_by_email, delete_user
from users.schemas import UserCreate, UserUpdate
from users.models import User
import logging
from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

# Configurar logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def get_patient_by_id(db: Session, patient_id: int):
    patient = db.query(Patient).options(joinedload(Patient.user)).filter(Patient.id == patient_id).first()
    logger.debug(f"Buscando paciente ID {patient_id}: {'Encontrado' if patient else 'No encontrado'}")
    return patient

def get_patient_by_user_id(db: Session, user_id: int):
    patient = db.query(Patient).options(joinedload(Patient.user)).filter(Patient.user_id == user_id).first()
    logger.debug(f"Buscando paciente para usuario ID {user_id}: {'Encontrado' if patient else 'No encontrado'}")
    return patient

def get_patients(db: Session, skip: int = 0, limit: int = 100):
    if limit > 1000:
        limit = 1000
    return db.query(Patient).options(joinedload(Patient.user)).offset(skip).limit(limit).all()

def create_patient_with_user(db: Session, patient_data: PatientCreate):
    if patient_data.role_id != 2:
        logger.error(f"Intento de crear paciente con role_id inválido: {patient_data.role_id}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El role_id debe ser 2 para pacientes")
    user_data = UserCreate(
        email=patient_data.email,
        password=patient_data.password,
        nombre=patient_data.nombre,
        apellido=patient_data.apellido,
        numero_telefono=patient_data.numero_telefono,
        direccion=patient_data.direccion,
        sexo=patient_data.sexo,
        role_id=patient_data.role_id
    )
    user = create_user(db, user_data)
    
    patient = Patient(
        user_id=user.id,
        fecha_nacimiento=patient_data.fecha_nacimiento
    )
    db.add(patient)
    try:
        db.commit()
        db.refresh(patient)
        logger.debug(f"Paciente creado con ID {patient.id} para usuario ID {user.id}")
        
        user.patient_user = patient
        db.commit()
        db.refresh(user)
        
        return patient
    except IntegrityError:
        db.rollback()
        logger.error(f"Error de integridad al crear paciente para usuario ID {user.id}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear el paciente, verifica los datos")

def create_patient(db: Session, patient_data: dict):
    db_patient = Patient(**patient_data)
    db.add(db_patient)
    try:
        db.commit()
        db.refresh(db_patient)
        logger.debug(f"Paciente creado con ID {db_patient.id}")
        return db_patient
    except IntegrityError:
        db.rollback()
        logger.error(f"Error de integridad al crear paciente con datos {patient_data}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear el paciente, verifica los datos")

def update_patient(db: Session, patient_id: int, patient_update: PatientUpdate):
    db_patient = get_patient_by_id(db, patient_id)
    if not db_patient:
        logger.error(f"Paciente con ID {patient_id} no encontrado")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Paciente no encontrado")
    
    update_data = patient_update.dict(exclude_unset=True)
    logger.debug(f"Datos de actualización recibidos para paciente ID {patient_id}: {update_data}")
    
    has_changes = False
    if 'fecha_nacimiento' in update_data:
        db_patient.fecha_nacimiento = update_data.pop('fecha_nacimiento')
        has_changes = True
        logger.debug(f"Fecha de nacimiento actualizada para paciente ID {patient_id}: {db_patient.fecha_nacimiento}")

    user_update_dict = {k: v for k, v in update_data.items()}
    if user_update_dict:
        user_update_data = UserUpdate(**user_update_dict)
        updated_user, user_changed = update_user(db, db_patient.user_id, user_update_data)
        if not updated_user:
            logger.error(f"No se pudo actualizar el usuario con ID {db_patient.user_id}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error al actualizar el usuario asociado")
        if user_changed:
            has_changes = True
            logger.debug(f"Usuario ID {db_patient.user_id} actualizado correctamente")

    if not has_changes:
        logger.debug(f"No hay datos para actualizar en paciente ID {patient_id} ni en su usuario asociado")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No hay datos para actualizar"
        )

    try:
        db.commit()
        db.refresh(db_patient)
        logger.debug(f"Paciente ID {patient_id} actualizado correctamente")
        return db_patient
    except IntegrityError:
        db.rollback()
        logger.error(f"Error de integridad al actualizar paciente ID {patient_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado o los datos son inválidos"
        )

def delete_patient(db: Session, patient_id: int) -> bool:
    db_patient = get_patient_by_id(db, patient_id)
    if db_patient:
        user_id = db_patient.user_id
        db.delete(db_patient)
        try:
            db.commit()
            logger.debug(f"Paciente ID {patient_id} eliminado correctamente")
            delete_user(db, user_id)
            return True
        except IntegrityError:
            db.rollback()
            logger.error(f"Error de integridad al eliminar paciente ID {patient_id}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se pudo eliminar el paciente debido a dependencias")
    return False