from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from database import get_db
from datetime import datetime, timedelta
from appointments.models import Appointment, AppointmentStatus
from users.models import User
from doctors.models import Doctor
from patients.models import Patient
from auth.routes import get_current_user

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"]
)

@router.get("/stats")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener estadísticas generales del dashboard."""
    
    # Total de citas
    total_appointments = db.query(Appointment).count()
    
    # Citas de hoy
    today = datetime.now().date()
    today_appointments = db.query(Appointment).filter(
        func.date(Appointment.date) == today
    ).count()
    
    # Total de pacientes
    total_patients = db.query(Patient).count()
    
    # Total de doctores
    total_doctors = db.query(Doctor).count()
    
    # Citas pendientes (futuras)
    pending_appointments = db.query(Appointment).filter(
        Appointment.date >= datetime.now()
    ).count()
    
    # Citas completadas (usar status_id o basarse en fecha pasada)
    completed_appointments = db.query(Appointment).filter(
        Appointment.date < datetime.now()
    ).count()
    
    return {
        "total_appointments": total_appointments,
        "today_appointments": today_appointments,
        "total_patients": total_patients,
        "total_doctors": total_doctors,
        "pending_appointments": pending_appointments,
        "completed_appointments": completed_appointments,
    }

@router.get("/appointments-trend")
async def get_appointments_trend(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener tendencia de citas de los últimos 7 días."""
    
    result = []
    for i in range(6, -1, -1):
        date = datetime.now().date() - timedelta(days=i)
        count = db.query(Appointment).filter(
            func.date(Appointment.date) == date
        ).count()
        
        result.append({
            "date": date.strftime("%d/%m"),
            "citas": count,
            "day": date.strftime("%a")
        })
    
    return result

@router.get("/upcoming-appointments")
async def get_upcoming_appointments(
    limit: int = 5,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener próximas citas."""
    
    appointments = db.query(Appointment).filter(
        Appointment.date >= datetime.now()
    ).order_by(Appointment.date.asc()).limit(limit).all()
    
    result = []
    for appointment in appointments:
        # Obtener datos del paciente
        patient = db.query(Patient).filter(Patient.id == appointment.patient_id).first()
        patient_user = db.query(User).filter(User.id == patient.user_id).first() if patient else None
        
        # Obtener datos del doctor
        doctor = db.query(Doctor).filter(Doctor.id == appointment.doctor_id).first()
        doctor_user = db.query(User).filter(User.id == doctor.user_id).first() if doctor else None
        
        # Obtener estado
        status = db.query(AppointmentStatus).filter(AppointmentStatus.id == appointment.status_id).first()
        
        result.append({
            "id": appointment.id,
            "fecha": appointment.date.isoformat(),
            "hora": appointment.date.strftime("%H:%M") if appointment.date else None,
            "motivo": appointment.type,
            "estado": status.name if status else "Desconocido",
            "patient_name": f"{patient_user.nombre} {patient_user.apellido}" if patient_user else "N/A",
            "doctor_name": f"{doctor_user.nombre} {doctor_user.apellido}" if doctor_user else "N/A",
        })
    
    return result
