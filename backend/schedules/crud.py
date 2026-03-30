from sqlalchemy.orm import Session, joinedload
from .models import Schedule, TimeSlot
from .schemas import ScheduleCreate, TimeSlotBase
from typing import List, Optional
from fastapi import HTTPException
from datetime import datetime
from appointments.models import Appointment

def get_schedules(
    db: Session,
    doctor_id: Optional[int] = None,
    only_enabled: bool = False,
    only_active_timeslots: bool = False,
    load_timeslots: bool = True
) -> List[Schedule]:
    """Función flexible para obtener schedules con filtros opcionales."""
    query = db.query(Schedule)
    if load_timeslots:
        query = query.options(
            joinedload(Schedule.time_slots)
        )
    if doctor_id is not None:
        query = query.filter(Schedule.doctor_id == doctor_id)
    if only_enabled:
        query = query.filter(Schedule.is_enabled == True)
    schedules = query.all()
    if only_active_timeslots:
        for schedule in schedules:
            schedule.time_slots = [ts for ts in schedule.time_slots if ts.is_active]
    return schedules

def get_schedules_by_doctor(db: Session, doctor_id: int) -> List[Schedule]:
    return get_schedules(db, doctor_id=doctor_id)

def get_available_schedules(db: Session, doctor_id: int) -> List[Schedule]:
    return get_schedules(db, doctor_id=doctor_id, only_enabled=True)

def get_all_schedules(db: Session):
    return get_schedules(db)

def get_schedules_by_doctor_id(db: Session, doctor_id: int):
    return get_schedules(db, doctor_id=doctor_id)

def get_active_schedules_by_doctor(db: Session, doctor_id: int):
    return get_schedules(db, doctor_id=doctor_id, only_enabled=True, only_active_timeslots=True)

def get_timeslot_by_id(db: Session, timeslot_id: int) -> TimeSlot:
    return db.query(TimeSlot).options(joinedload(TimeSlot.schedule)).filter(TimeSlot.id == timeslot_id).first()

def create_schedules(db: Session, doctor_id: int, schedules: List[ScheduleCreate]) -> List[Schedule]:
    db_schedules = []

    for schedule in schedules:
        print(f"Procesando schedule para {schedule.day}, doctor_id: {doctor_id}")
        # Buscar si ya existe el día para este doctor
        db_schedule = db.query(Schedule).filter(
            Schedule.doctor_id == doctor_id,
            Schedule.day == schedule.day
        ).first()

        if not db_schedule:
            db_schedule = Schedule(
                doctor_id=doctor_id,
                day=schedule.day,
                is_enabled=schedule.is_enabled
            )
            db.add(db_schedule)
            db.flush()  # Flush para obtener ID inmediatamente si es nuevo
        else:
            # Actualizar is_enabled si existe
            db_schedule.is_enabled = schedule.is_enabled

        # Procesar time_slots: update si id existe, create si no
        for timeslot in schedule.time_slots:
            timeslot_data = timeslot.dict(exclude={'id'})  # Excluir id para creación
            timeslot_id = timeslot.id  # Optional

            if timeslot_id:
                # Update existente
                db_timeslot = db.query(TimeSlot).filter(TimeSlot.id == timeslot_id).first()
                if not db_timeslot or db_timeslot.schedule_id != db_schedule.id:
                    raise HTTPException(
                        status_code=404, detail=f"Time slot {timeslot_id} no encontrado o no pertenece a este schedule"
                    )
                # Chequeo de superposiciones excluyendo a sí mismo
                overlap = db.query(TimeSlot).filter(
                    TimeSlot.schedule_id == db_schedule.id,
                    TimeSlot.id != timeslot_id,
                    TimeSlot.start_time < timeslot.end_time,
                    TimeSlot.end_time > timeslot.start_time
                ).first()
                if overlap:
                    raise HTTPException(
                        status_code=400,
                        detail=f"El horario {timeslot.start_time}-{timeslot.end_time} se superpone con uno existente en {schedule.day}"
                    )
                # Actualizar campos
                db_timeslot.start_time = timeslot.start_time
                db_timeslot.end_time = timeslot.end_time
                db_timeslot.is_active = timeslot.is_active
            else:
                # Create nuevo
                # Chequeo de superposiciones
                overlap = db.query(TimeSlot).filter(
                    TimeSlot.schedule_id == db_schedule.id,
                    TimeSlot.start_time < timeslot.end_time,
                    TimeSlot.end_time > timeslot.start_time
                ).first()
                if overlap:
                    raise HTTPException(
                        status_code=400,
                        detail=f"El horario {timeslot.start_time}-{timeslot.end_time} se superpone con uno existente en {schedule.day}"
                    )
                db_timeslot = TimeSlot(
                    schedule_id=db_schedule.id,
                    **timeslot_data
                )
                db.add(db_timeslot)

        db_schedules.append(db_schedule)

    db.commit()
    for sch in db_schedules:
        db.refresh(sch)
    return db_schedules

def get_available_time_slots(db: Session, doctor_id: int, date_str: str):
    try:
        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        # Usa weekday() (0=Lunes, 6=Domingo)
        weekday_index = date_obj.weekday()
        days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']
        day = days[weekday_index]
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato de fecha inválido")

    # Encontrar el schedule para el doctor y día
    schedule = db.query(Schedule).filter(
        Schedule.doctor_id == doctor_id,
        Schedule.day == day,
        Schedule.is_enabled == True
    ).first()

    if not schedule:
        return []

    # Filtrar time_slots activos y no ocupados
    available_slots = []
    for ts in schedule.time_slots:
        if not ts.is_active:
            continue
        # Chequear si ya hay appointment en esta fecha y time_slot
        occupied = db.query(Appointment).filter(
            Appointment.doctor_id == doctor_id,  # Agrega esto para más precisión
            Appointment.time_slot_id == ts.id,
            Appointment.date == date_obj,
            Appointment.status_id != 3  # Asume status_id 3 es "Cancelada", ajusta según tu modelo
        ).first()
        if not occupied:
            available_slots.append(ts)

    return available_slots

def update_timeslot(db: Session, schedule_id: int, timeslot_id: int, timeslot_data: TimeSlotBase) -> Schedule:
    ts = db.query(TimeSlot).filter(
        TimeSlot.id == timeslot_id,
        TimeSlot.schedule_id == schedule_id
    ).first()
    if not ts:
        raise HTTPException(status_code=404, detail="Time slot no encontrado")

    # Verificar superposiciones con otros time slots
    overlap = db.query(TimeSlot).filter(
        TimeSlot.schedule_id == schedule_id,
        TimeSlot.id != timeslot_id,
        TimeSlot.start_time < timeslot_data.end_time,
        TimeSlot.end_time > timeslot_data.start_time
    ).first()

    if overlap:
        raise HTTPException(
            status_code=400,
            detail=f"El horario {timeslot_data.start_time}-{timeslot_data.end_time} se superpone con uno existente"
        )

    # Actualizar el time_slot
    ts.start_time = timeslot_data.start_time
    ts.end_time = timeslot_data.end_time
    ts.is_active = timeslot_data.is_active

    db.commit()

    # Devolver la Schedule con todos sus TimeSlots cargados
    schedule = db.query(Schedule).options(joinedload(Schedule.time_slots)).filter(Schedule.id == schedule_id).first()
    db.refresh(schedule)
    return schedule

def toggle_schedule_enabled(db: Session, schedule_id: int) -> Schedule:
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule no encontrado")
    schedule.is_enabled = not schedule.is_enabled
    db.commit()
    db.refresh(schedule)
    # Refrescar con time_slots para consistencia
    return db.query(Schedule).options(joinedload(Schedule.time_slots)).filter(Schedule.id == schedule_id).first()

def toggle_timeslot_active(db: Session, schedule_id: int, timeslot_id: int) -> Schedule:
    ts = db.query(TimeSlot).filter(
        TimeSlot.id == timeslot_id,
        TimeSlot.schedule_id == schedule_id
    ).first()
    if not ts:
        raise HTTPException(status_code=404, detail="Time slot no encontrado")

    ts.is_active = not ts.is_active
    db.commit()

    return db.query(Schedule).options(joinedload(Schedule.time_slots)).filter(Schedule.id == schedule_id).first()


def delete_timeslot(db: Session, schedule_id: int, timeslot_id: int) -> Schedule:
    """Eliminar un time slot y devolver el schedule actualizado."""
    ts = db.query(TimeSlot).filter(
        TimeSlot.id == timeslot_id,
        TimeSlot.schedule_id == schedule_id
    ).first()

    if not ts:
        raise HTTPException(status_code=404, detail="Time slot no encontrado")

    db.delete(ts)
    db.commit()

    # Devuelve el schedule padre actualizado con sus time_slots
    return db.query(Schedule).options(joinedload(Schedule.time_slots)).filter(Schedule.id == schedule_id).first()
