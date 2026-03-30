from typing import Optional
from pydantic import BaseModel, validator
from datetime import datetime

# Imports de schemas existentes (basado en tu estructura app/)
from users.schemas import UserOut  # Para referencia en flatten
from doctors.schemas import DoctorResponse  # Flatten: UserOut + especialidad
from patients.schemas import PatientResponse  # Flatten: UserOut + fecha_nacimiento
from schedules.schemas import TimeSlot  # Con validators para tiempos

class AppointmentStatusBase(BaseModel):  
    name: str
    description: Optional[str] = None

class AppointmentStatusCreate(AppointmentStatusBase):
    pass


class AppointmentStatus(AppointmentStatusBase):
    id: int

    class Config:
        orm_mode = True

class AppointmentBase(BaseModel):
    type: str
    doctor_id: int
    patient_id: int
    time_slot_id: int
    date: datetime
    cost: Optional[float] = 0.0
    notes: Optional[str] = None
    status_id: Optional[int] = None

class AppointmentCreate(AppointmentBase):
    @validator('date', pre=True)
    def parse_date(cls, v):
        if isinstance(v, str):
            try:
                return datetime.fromisoformat(v)
            except ValueError:
                raise ValueError('Formato de fecha inválido, debe ser YYYY-MM-DD')
        return v

class AppointmentUpdate(BaseModel):
    type: Optional[str] = None
    status_id: Optional[int] = None
    notes: Optional[str] = None
    is_paid: Optional[bool] = None

class Appointment(AppointmentBase):
    id: int
    code: str
    status_id: int
    is_paid: bool

    class Config:
        orm_mode = True

class AppointmentOut(Appointment):
    doctor: DoctorResponse  # Flatten maneja user
    patient: PatientResponse  # Flatten maneja user
    time_slot: TimeSlot  # Validators manejan time -> str
    status: AppointmentStatus

    class Config:
        orm_mode = True