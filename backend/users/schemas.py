from typing import Optional, Annotated, Literal
from pydantic import BaseModel, Field, validator, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    nombre: str
    apellido: str
    numero_telefono: Optional[str] = None
    direccion: Optional[str] = None
    sexo: Literal["M", "F"]
    role_id: int

    @validator("role_id")
    def validate_role_id(cls, role_id: int) -> int:
        if role_id not in [1, 2, 3]:
            raise ValueError("El role_id debe ser 1, 2 o 3")
        return role_id

    class Config:
        orm_mode = True

class UserCreate(UserBase):
    password: Annotated[str, Field(min_length=8, max_length=16)]
    @validator("password", pre=True)
    def validate_password(cls, password: str) -> str:
        if len(password) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres")
        if len(password) > 16:
            raise ValueError("La contraseña debe tener como máximo 16 caracteres")
        return password

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    numero_telefono: Optional[str] = None
    direccion: Optional[str] = None
    sexo: Optional[Literal["M", "F"]] = None
    role_id: Optional[int] = None
    password: Optional[Annotated[str, Field(min_length=8, max_length=16)]] = None

    @validator("password", pre=True)
    def validate_password(cls, password: Optional[str]) -> Optional[str]:
        if password:
            if len(password) < 8:
                raise ValueError("La contraseña debe tener al menos 8 caracteres")
            if len(password) > 16:
                raise ValueError("La contraseña debe tener como máximo 16 caracteres")
            if password.startswith('$2b$'):
                raise ValueError("La contraseña no debe estar hasheada")
        return password

    @validator("role_id")
    def validate_role_id(cls, role_id: Optional[int]) -> Optional[int]:
        if role_id is not None and role_id not in [1, 2, 3]:
            raise ValueError("El role_id debe ser 1, 2 o 3")
        return role_id

    class Config:
        orm_mode = True

class UserOut(UserBase):
    id: int
    class Config:
        orm_mode = True

class User(UserBase):
    id: int
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginInput(BaseModel):
    email: EmailStr
    password: str