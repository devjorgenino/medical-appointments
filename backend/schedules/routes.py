from typing import List
from fastapi import Depends, HTTPException, status, APIRouter, Query
from sqlalchemy.orm import Session
from database import get_db
from users.models import User
from auth.routes import get_current_user
from .models import Schedule as DBSchedule  
from .schemas import Schedule as ScheduleSchema, ScheduleCreate, TimeSlotBase, TimeSlot 
from .crud import get_schedules_by_doctor, create_schedules, get_available_schedules, update_timeslot, toggle_schedule_enabled, toggle_timeslot_active, delete_timeslot, get_available_time_slots
from doctors.crud import get_doctor_by_user_id
from sqlalchemy.orm import joinedload
from auth.routes import get_current_user
from datetime import date



router = APIRouter(
    prefix="/schedules",
    tags=["schedules"]
)

@router.get("/", response_model=List[ScheduleSchema])
async def read_my_schedules(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Admin y Doctor puede ver horarios disponibles."""
    try:
        query = db.query(DBSchedule).options(
            joinedload(DBSchedule.time_slots)
        )
        if current_user.role_id == 1:  # Admin → todas las agendas
            schedules = query.all()
        elif current_user.role_id == 3:  # Doctor → solo sus agendas
            doctor_data = get_doctor_by_user_id(db, user_id=current_user.id)
            print(f"Datos del doctor: {doctor_data}")
            if not doctor_data:
                raise HTTPException(status_code=404, detail="Doctor no encontrado")
            schedules = query.filter(DBSchedule.doctor_id == doctor_data.id).all()
        else:
            raise HTTPException(status_code=403, detail="Not authorized")
        print(f"Horarios devueltos: {len(schedules)}")
        return schedules
    except Exception as e:
        print(f"Error en read_my_schedules: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error interno al obtener horarios: {str(e)}")

@router.get("/doctor/{doctor_id}", response_model=List[ScheduleSchema])
async def read_doctor_schedules(doctor_id: int, db: Session = Depends(get_db)):
    """Paciente puede ver horarios disponibles de un doctor."""
    schedules = get_available_schedules(db, doctor_id=doctor_id)
    if not schedules:
        raise HTTPException(status_code=404, detail="Horarios no encontrados para este doctor")
    return schedules

@router.post("/", response_model=List[ScheduleSchema])
async def create_schedule(
    schedules: List[ScheduleCreate],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crear o actualizar horarios para el doctor actual."""
    if current_user.role_id not in [1, 3]:  # Solo admin o doctor
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if not schedules:
        raise HTTPException(status_code=400, detail="Debe proporcionar al menos un horario")
    
    # Derivar doctor_id
    if current_user.role_id == 3:
        doctor_data = get_doctor_by_user_id(db, user_id=current_user.id)
        if not doctor_data:
            raise HTTPException(status_code=404, detail="Doctor no encontrado")
        doctor_id = doctor_data.id
        # Para doctores, ignoramos doctor_id del payload (puede estar mal seteado en frontend)
    else:  # Admin (rol 1): tomar del payload y validar consistencia
        doctor_id = schedules[0].doctor_id
        for sch in schedules:
            if sch.doctor_id != doctor_id:
                raise HTTPException(status_code=400, detail="Todos los horarios deben tener el mismo doctor_id")
    
    return create_schedules(db, doctor_id, schedules)

@router.put("/{schedule_id}/timeslot/{timeslot_id}", response_model=ScheduleSchema)
async def update_timeslot_endpoint(
    schedule_id: int,
    timeslot_id: int,
    timeslot_data: TimeSlotBase,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Actualizar un time slot específico."""
    if current_user.role_id not in [1, 3]:  # Admin o Doctor
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Validación para doctor
    if current_user.role_id == 3:
        doctor_data = get_doctor_by_user_id(db, user_id=current_user.id)
        schedule = db.query(DBSchedule).filter(DBSchedule.id == schedule_id).first()
        if not schedule:
            raise HTTPException(status_code=404, detail="Schedule no encontrado")
        if schedule.doctor_id != doctor_data.id:
            raise HTTPException(status_code=403, detail="No autorizado para este schedule")
    
    return update_timeslot(db, schedule_id, timeslot_id, timeslot_data)

@router.patch("/{schedule_id}/toggle", response_model=ScheduleSchema)
async def toggle_schedule(
    schedule_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Toggle habilitar/deshabilitar un schedule."""
    if current_user.role_id not in [1, 3]:  # Admin o Doctor
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if current_user.role_id == 3:
        doctor_data = get_doctor_by_user_id(db, user_id=current_user.id)
        schedule = db.query(DBSchedule).filter(DBSchedule.id == schedule_id).first()
        if not schedule:
            raise HTTPException(status_code=404, detail="Schedule no encontrado")
        if schedule.doctor_id != doctor_data.id:
            raise HTTPException(status_code=403, detail="No autorizado para este schedule")
    
    return toggle_schedule_enabled(db, schedule_id)

@router.patch("/{schedule_id}/timeslot/{timeslot_id}/toggle", response_model=ScheduleSchema)
async def toggle_timeslot(
    schedule_id: int,
    timeslot_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Toggle activar/desactivar un time slot específico."""
    if current_user.role_id not in [1, 3]:  # Admin o Doctor
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if current_user.role_id == 3:
        doctor_data = get_doctor_by_user_id(db, user_id=current_user.id)
        schedule = db.query(DBSchedule).filter(DBSchedule.id == schedule_id).first()
        if not schedule:
            raise HTTPException(status_code=404, detail="Schedule no encontrado")
        if schedule.doctor_id != doctor_data.id:
            raise HTTPException(status_code=403, detail="No autorizado para este schedule")
    
    return toggle_timeslot_active(db, schedule_id, timeslot_id)


@router.delete("/{schedule_id}/timeslot/{timeslot_id}", response_model=ScheduleSchema)
def delete_timeslot_endpoint(
    schedule_id: int,
    timeslot_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Eliminar un time slot específico y devolver el schedule actualizado."""
    # ... (toda tu lógica de validación de roles va aquí) ...
    if current_user.role_id not in [1, 3]:
        raise HTTPException(status_code=403, detail="Not authorized")
    # ... etc.

    updated_schedule = delete_timeslot(db, schedule_id, timeslot_id)
    if not updated_schedule:
         raise HTTPException(status_code=404, detail="Schedule no encontrado tras eliminar el timeslot")
         
    return updated_schedule

@router.get("/time-slots/", response_model=List[TimeSlot])
def read_available_time_slots(
    doctor_id: int = Query(...),
    date: date = Query(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener time slots disponibles para un doctor en una fecha específica."""
    if current_user.role_id not in [1, 2, 3]:  # Permite admins, pacientes y doctores
        raise HTTPException(status_code=403, detail="No autorizado")
    
    available_slots = get_available_time_slots(db, doctor_id, date.strftime('%Y-%m-%d'))
    return available_slots
