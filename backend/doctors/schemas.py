from pydantic import BaseModel, EmailStr, validator
from typing import Optional, Literal

from users.schemas import UserCreate, UserUpdate, UserOut  # Importamos para herencia

class DoctorBase(BaseModel):
    especialidad: Optional[str] = None

class DoctorCreate(UserCreate, DoctorBase):
    pass

class DoctorUpdate(UserUpdate, DoctorBase):
    pass

class DoctorResponse(UserOut, DoctorBase):
    user_id: int

    class Config:
        orm_mode = True

    @classmethod
    def from_orm(cls, obj):
        # Flatten manual para poblar fields heredados de UserOut desde obj.user
        data = {
            'id': obj.id,  # Doctor.id
            'user_id': obj.user_id,
            'especialidad': obj.especialidad,
            'email': obj.user.email,
            'nombre': obj.user.nombre,
            'apellido': obj.user.apellido,
            'numero_telefono': obj.user.numero_telefono,
            'direccion': obj.user.direccion,
            'sexo': obj.user.sexo,
            'role_id': obj.user.role_id,
        }
        return cls(**data)