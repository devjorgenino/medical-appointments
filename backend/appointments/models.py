from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Boolean
from sqlalchemy.orm import relationship
from database import Base

class AppointmentStatus(Base):
    __tablename__ = "appointment_statuses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)  # e.g., "Próxima", "Pasada", "Cancelada"
    description = Column(String, nullable=True)  # Opcional: "Cita pendiente", etc.

    appointments = relationship("Appointment", back_populates="status")

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False)  # Autogenerado, e.g., "ZY-00001"
    type = Column(String, nullable=False)  # e.g., "Consulta General", "Cardiología"
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    time_slot_id = Column(Integer, ForeignKey("time_slots.id"), nullable=False)
    date = Column(DateTime, nullable=False)  # Fecha y hora completa de la cita
    cost = Column(Float, default=0.0)
    status_id = Column(Integer, ForeignKey("appointment_statuses.id"), nullable=False)
    notes = Column(String, nullable=True)
    is_paid = Column(Boolean, default=False)

    doctor = relationship("Doctor", back_populates="appointments")
    patient = relationship("Patient", back_populates="appointments")
    time_slot = relationship("TimeSlot", back_populates="appointments")
    status = relationship("AppointmentStatus", back_populates="appointments")

# Agrega back_populates en models existentes:
# En doctors/models.py: appointments = relationship("Appointment", back_populates="doctor")
# En patients/models.py: appointments = relationship("Appointment", back_populates="patient")
# En schedules/models.py (TimeSlot): appointments = relationship("Appointment", back_populates="time_slot")  # Ya lo tienes