from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from database import get_db
from .models import User
from .schemas import User, UserCreate, UserUpdate, UserOut
from .crud import get_user_by_email, get_users, create_user, update_user, delete_user, get_user_by_id
from auth.routes import get_current_user
from roles.crud import get_role_by_id
import logging

# Configurar logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/", response_model=list[UserOut])
async def read_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role_id != 1:  
        raise HTTPException(status_code=403, detail="Not authorized")
    return get_users(db)

@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user_endpoint(user: UserCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role_id != 1:
        raise HTTPException(status_code=403, detail="Not authorized")
    if get_user_by_email(db, email=user.email):
        raise HTTPException(status_code=400, detail="Email ya registrado")
    if not get_role_by_id(db, user.role_id):
        raise HTTPException(status_code=400, detail="Rol Invalido")
    try:
        new_user = create_user(db, user=user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return new_user

@router.put("/{user_id}", response_model=UserOut)
async def update_user_endpoint(user_id: int, user_data: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role_id != 1:  
        raise HTTPException(status_code=403, detail="Not authorized")
    db_user = get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if user_data.role_id is not None and not get_role_by_id(db, user_data.role_id):
        raise HTTPException(status_code=400, detail="Invalid role_id")
    
    logger.debug(f"Cuerpo de la solicitud PUT /users/{user_id}: {user_data.dict(exclude_unset=True)}")
    try:
        updated_user, has_changes = update_user(db, user_id, user_data)
        if not updated_user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        if not has_changes:
            logger.debug(f"No hay datos para actualizar en usuario ID {user_id}")
            raise HTTPException(status_code=400, detail="No hay datos para actualizar")
        return updated_user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{user_id}")
async def delete_user_endpoint(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role_id != 1:  
        raise HTTPException(status_code=403, detail="Not authorized")
    db_user = get_user_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    delete_user(db, user_id)
    return {"message": "User Eliminado exitosamente"}

@router.post("/register", response_model=User)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    if not get_role_by_id(db, user.role_id):
        raise HTTPException(status_code=400, detail="Rol Invalido")

    return create_user(db, user=user)