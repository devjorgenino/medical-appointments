from typing import Optional, Annotated, Literal
from pydantic import BaseModel, Field, validator, EmailStr

class PasswordReset(BaseModel):
    email: EmailStr

class RestorePassword(BaseModel):
    new_password: Optional[Annotated[str, Field(min_length=8, max_length=16)]] = None

    @validator("new_password", pre=True)
    def validate_password(cls, new_password: Optional[str]) -> Optional[str]:
        if new_password:
            if len(new_password) < 8:
                raise ValueError("La contraseña debe tener al menos 8 caracteres")
            if len(new_password) > 16:
                raise ValueError("La contraseña debe tener como máximo 16 caracteres")
        return new_password
