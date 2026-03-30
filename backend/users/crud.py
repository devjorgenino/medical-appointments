from sqlalchemy.orm import Session, joinedload
from .models import User
from .schemas import UserCreate, UserUpdate
from doctors.models import Doctor
from patients.models import Patient
from fastapi import HTTPException, status
from crypt import get_password_hash
import logging
from sqlalchemy.exc import IntegrityError

# Configurar logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def get_user_by_email(db: Session, email: str):
    user = (db.query(User).options(joinedload(User.doctor_user),
                                   joinedload(User.patient_user))
                           .filter(User.email == email).first())
    logger.debug(f"Buscando email {email}: ID {user.id if user else None}")
    return user

def get_user_by_id(db: Session, user_id: int):
    user = (db.query(User).options(joinedload(User.doctor_user),
                                   joinedload(User.patient_user))
                           .filter(User.id == user_id).first())
    logger.debug(f"Buscando usuario ID {user_id}: {'Encontrado' if user else 'No encontrado'}")
    return user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    if limit > 1000:
        limit = 1000
    return (db.query(User).options(joinedload(User.doctor_user),
                                   joinedload(User.patient_user))
                           .offset(skip).limit(limit).all())

def create_user(db: Session, user: UserCreate):
    if user.role_id not in [1, 2, 3]:
        logger.error(f"Intento de crear usuario con role_id inválido: {user.role_id}")
        raise ValueError("Rol no válido o no soportado para creación de usuario")
    if not user.password:
        logger.error("Intento de crear usuario sin contraseña")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La contraseña es obligatoria")
    db_user = User(
        email=user.email,
        password=user.password,
        nombre=user.nombre,
        apellido=user.apellido,
        numero_telefono=user.numero_telefono,
        direccion=user.direccion,
        sexo=user.sexo,
        role_id=user.role_id
    )
    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user)
        logger.debug(f"Usuario creado con ID {db_user.id} y email {db_user.email}")
        return db_user
    except IntegrityError:
        db.rollback()
        logger.error(f"Error de integridad al crear usuario con email {user.email}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El email ya está registrado")

def update_user(db: Session, user_id: int, user: UserUpdate) -> tuple[User | None, bool]:
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        logger.error(f"Usuario con ID {user_id} no encontrado")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    update_data = user.dict(exclude_unset=True)
    logger.debug(f"Datos de actualización para usuario ID {user_id}: {update_data}, correo actual: {db_user.email}")
    
    has_changes = False
    
    if "email" in update_data:
        new_email = update_data["email"]
        existing_user = get_user_by_email(db, new_email)
        if existing_user and existing_user.id != user_id:
            logger.error(f"El email {new_email} ya está registrado para el usuario ID {existing_user.id}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado para otro usuario"
            )
        if new_email == db_user.email:
            logger.debug(f"El email {new_email} es el mismo que el actual, no se requiere actualización")
            del update_data["email"]
        else:
            has_changes = True
    
    if "password" in update_data:
        if update_data["password"]:
            db_user.password = update_data["password"]
            logger.debug(f"Contraseña actualizada para usuario ID {user_id}")
            has_changes = True
        del update_data['password']

    if update_data:
        for field, value in update_data.items():
            setattr(db_user, field, value)
            has_changes = True

    if not has_changes:
        logger.debug(f"No hay datos para actualizar en usuario ID {user_id}")
        return db_user, False

    try:
        db.commit()
        db.refresh(db_user)
        logger.debug(f"Usuario ID {user_id} actualizado correctamente")
        return db_user, True
    except IntegrityError:
        db.rollback()
        logger.error(f"Error de integridad al actualizar usuario ID {user_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado o los datos son inválidos"
        )

def delete_user(db: Session, user_id: int):
    db_user = get_user_by_id(db, user_id)
    if db_user:
        db.delete(db_user)
        try:
            db.commit()
            logger.debug(f"Usuario ID {user_id} eliminado correctamente")
        except IntegrityError:
            db.rollback()
            logger.error(f"Error de integridad al eliminar usuario ID {user_id}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se pudo eliminar el usuario debido a dependencias")
    return None