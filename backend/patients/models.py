from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    fecha_nacimiento = Column(Date, nullable=True)

    user = relationship("User", back_populates="patient_user")
    appointments = relationship("Appointment", back_populates="patient")