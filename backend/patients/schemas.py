from pydantic import BaseModel, EmailStr, validator
from typing import Optional, Literal
from datetime import date

from users.schemas import UserCreate, UserUpdate, UserOut  # Importamos para herencia en Create/Update/Response

class PatientBase(BaseModel):
    fecha_nacimiento: Optional[date] = None

class PatientCreate(UserCreate, PatientBase):
    pass

class PatientUpdate(UserUpdate, PatientBase):
    pass

class PatientResponse(UserOut, PatientBase):
    user_id: int

    class Config:
        orm_mode = True

    @classmethod
    def from_orm(cls, obj):
        # Flatten manual para poblar fields heredados de UserOut desde obj.user
        data = {
            'id': obj.id,  # Patient.id
            'user_id': obj.user_id,
            'fecha_nacimiento': obj.fecha_nacimiento,
            'email': obj.user.email,
            'nombre': obj.user.nombre,
            'apellido': obj.user.apellido,
            'numero_telefono': obj.user.numero_telefono,
            'direccion': obj.user.direccion,
            'sexo': obj.user.sexo,
            'role_id': obj.user.role_id,
        }
        return cls(**data)