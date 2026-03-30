from typing import List, Literal, Optional
from datetime import time, datetime
from pydantic import BaseModel, validator

class TimeSlotBase(BaseModel):
    start_time: str
    end_time: str
    is_active: bool = True

    @validator('start_time', 'end_time', pre=True)
    def validate_time_format(cls, v):
        if isinstance(v, time):
            return v.strftime('%H:%M:%S')  # Mantiene SS de DB
        try:
            # Acepta HH:MM o HH:MM:SS
            if len(v.split(':')) == 2:
                datetime.strptime(v, '%H:%M')
                return v + ':00'
            else:
                datetime.strptime(v, '%H:%M:%S')
                return v
        except ValueError:
            raise ValueError('El formato de la hora debe ser HH:MM o HH:MM:SS')

    @validator('end_time')
    def end_after_start(cls, v, values):
        if 'start_time' in values:
            start = datetime.strptime(values['start_time'], '%H:%M:%S')
            end = datetime.strptime(v, '%H:%M:%S')
            if end <= start:
                raise ValueError('end_time debe ser después de start_time')
        return v

class TimeSlotCreate(TimeSlotBase):
    id: Optional[int] = None  
    class Config:
        extra = "forbid"

class TimeSlot(TimeSlotBase):
    id: int
    class Config:
        orm_mode = True

class ScheduleBase(BaseModel):
    day: Literal['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']
    is_enabled: bool = True
    doctor_id: int
    
class ScheduleCreate(ScheduleBase):
    time_slots: List[TimeSlotCreate]

    @validator('time_slots')
    def at_least_one_timeslot(cls, v):
        if not v:
            raise ValueError('Debe proporcionar al menos un time_slot')
        return v

class Schedule(ScheduleBase):
    id: int
    time_slots: List[TimeSlot]

    class Config:
        orm_mode = True