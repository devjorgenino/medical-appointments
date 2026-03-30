from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from crypt import verify_password
from users.models import User
from .schemas import ProfileBase, ProfileUpdate, ProfilePasswordUpdate
from users.crud import update_user, get_user_by_id
from users.schemas import UserUpdate
from auth.routes import get_current_user  # Importar la función de autenticación
import logging

logger = logging.getLogger(__name__) 

router = APIRouter(
    prefix="/profile",
    tags=["profile"]
)

@router.get("/", response_model=ProfileBase)
async def read_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Obtener el perfil del usuario actual."""
    user = get_user_by_id(db, user_id=current_user.id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    print(f"Perfil del usuario: {user.sexo}")
    return user

@router.put("/", response_model=ProfileBase)
async def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Actualizar el perfil del usuario actual."""
    user = get_user_by_id(db, user_id=current_user.id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = UserUpdate.construct(
        email=profile_data.email,
        nombre=profile_data.nombre,
        apellido=profile_data.apellido,
        numero_telefono=profile_data.numero_telefono,
        direccion=profile_data.direccion,
        sexo=profile_data.sexo,
    )
    try:
        user, has_changes = update_user(
            db,
            user_id=user.id,
            user=user_data
        )
        if not has_changes:
            logger.debug(f"No hay datos para actualizar en usuario ID {user.id}")
            raise HTTPException(status_code=400, detail="No hay datos para actualizar")
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/password", response_model=ProfileBase)
async def update_password(
    password_data: ProfilePasswordUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Actualizar la contraseña del usuario actual."""
    user = get_user_by_id(db, user_id=current_user.id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not verify_password(password_data.current_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Old password is incorrect")
    
    # Actualizar la contraseña usando el setter que hashea automáticamente
    user.password = password_data.new_password
    # Marcar explícitamente como modificado para asegurar que SQLAlchemy lo detecte
    db.add(user)
    db.commit()
    db.refresh(user)
    
    logger.info(f"Contraseña actualizada exitosamente para usuario ID {user.id}")
    
    return user
