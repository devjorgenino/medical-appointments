from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Doctor(Base):
    __tablename__ = "doctors"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    especialidad = Column(String, nullable=False)
    #citas = relationship("Cita", back_populates="doctor")  
    #consultorio = Column(String, nullable=True)


    user = relationship("User", back_populates="doctor_user")
    appointments = relationship("Appointment", back_populates="doctor")
    
    
