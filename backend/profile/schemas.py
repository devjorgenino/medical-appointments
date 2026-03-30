from pydantic import BaseModel, Field, validator, EmailStr

from typing import Optional, Literal, Annotated

class ProfileBase(BaseModel):
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

class ProfileUpdate(BaseModel):
    email: Optional[EmailStr] = None
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    numero_telefono: Optional[str] = None
    direccion: Optional[str] = None
    sexo: Optional[Literal["M", "F"]] = None

class ProfilePasswordUpdate(BaseModel):
    current_password: str
    new_password: Annotated[str, Field(min_length=8, max_length=16)]

    @validator("new_password", pre=True)
    def validate_new_password(cls, new_password: str) -> str:
        if len(new_password) < 8:
            raise ValueError("La nueva contraseña debe tener al menos 8 caracteres")
        if len(new_password) > 16:
            raise ValueError("La nueva contraseña debe tener como máximo 16 caracteres")
        return new_password
