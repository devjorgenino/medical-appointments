from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
import jwt
import os
from jwt import PyJWTError
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordBearer, OAuth2PasswordRequestForm
from crypt import verify_password, get_password_hash
from database import SessionLocal
from users.models import User
from users.schemas import LoginInput, Token
from auth.schemas import RestorePassword, PasswordReset
from .crud import create_action_token, get_action_token, restore_password

router = APIRouter()

# Security: Load SECRET_KEY from environment variables
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable is not set. Please configure it before running the application.")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

#oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)
bearer_scheme = HTTPBearer()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except PyJWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/auth/login", response_model=Token)
async def login(payload: LoginInput, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = create_access_token(data={
        "sub": user.email,
        "id": user.id,
        "role_id": user.role_id,
        "nombre": user.nombre or "",
        "apellido": user.apellido or "",
        "numero_telefono": user.numero_telefono,
        "direccion": user.direccion,
        "sexo": user.sexo
    })
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/auth/refresh", response_model=Token)
async def refresh_token(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
):
    """
    Endpoint para refrescar/renovar el token de acceso.
    Toma el token actual, lo valida y genera uno nuevo con el mismo tiempo de expiración.
    """
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decodificar el token (incluso si está cerca de expirar)
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_exp": False})
        email: str = payload.get("sub")
        
        if email is None:
            raise credentials_exception
            
        # Verificar que el usuario existe
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise credentials_exception
        
        # Crear un nuevo token con los mismos datos
        access_token = create_access_token(data={
            "sub": user.email,
            "id": user.id,
            "role_id": user.role_id,
            "nombre": user.nombre or "",
            "apellido": user.apellido or "",
            "numero_telefono": user.numero_telefono,
            "direccion": user.direccion,
            "sexo": user.sexo
        })
        
        return {"access_token": access_token, "token_type": "bearer"}
    except PyJWTError:
        raise credentials_exception

@router.post("/auth/logout")
async def logout():
    return {"message": "Logged out successfully"}

@router.post("/auth/password-reset")
async def password_reset(request: PasswordReset, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    action_token = create_action_token(db, user.id)
    if not action_token:
        raise HTTPException(status_code=500, detail="Could not create action token")
    
    reset_link = f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/reset-password?token={action_token.token}"
    from mail import send_email
    subject = "Recuperación de contraseña - MedicalApp"
    # TODO: Cambia la URL por la de tu aplicación
    body = reset_link
    to_email = user.email
    
    await send_email(subject, body, to_email)

    return {"message": "Password reset link sent to your email."}

@router.get("/auth/action-token/{token}")
async def get_action_token_endpoint(token: str, db: Session = Depends(get_db)):
    action_token = get_action_token(db, token)
    if not action_token:
        raise HTTPException(status_code=404, detail="Action token not found")
    
    if action_token.is_used:
        raise HTTPException(status_code=400, detail="Action token has already been used")
    
    return {"token": action_token.token, "user_id": action_token.user_id, "expiration": action_token.expiration}

@router.post("/auth/action-token/{token}/use")
async def use_action_token(token: str, request: RestorePassword, db: Session = Depends(get_db)):
    action_token = get_action_token(db, token)
    if not action_token:
        raise HTTPException(status_code=404, detail="Action token not found")
    
    if action_token.is_used:
        raise HTTPException(status_code=400, detail="Action token has already been used")
    
    restore_password(db, token, new_password=request.new_password)
    
    return {"message": "Action token used successfully."}

