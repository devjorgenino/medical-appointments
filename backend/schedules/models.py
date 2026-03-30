from typing import List
from sqlalchemy.orm import relationship, Mapped
from sqlalchemy import Column, Integer, String, ForeignKey, Time, Boolean, UniqueConstraint, CheckConstraint
from users.models import Base

class Schedule(Base):
    __tablename__ = "schedules"
    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    day = Column(String)
    is_enabled = Column(Boolean, default=True) 

    time_slots: Mapped[List["TimeSlot"]] = relationship(back_populates="schedule")

    # __table_args__ = (
    #     UniqueConstraint('doctor_id', 'day', name='unique_doctor_day'),
    # )

class TimeSlot(Base):
    __tablename__ = "time_slots"
    id = Column(Integer, primary_key=True, index=True)
    schedule_id = Column(Integer, ForeignKey("schedules.id"))
    start_time = Column(Time)
    end_time = Column(Time)
    is_active = Column(Boolean, default=True)

    schedule: Mapped["Schedule"] = relationship(back_populates="time_slots")
    appointments = relationship("Appointment", back_populates="time_slot")

    # __table_args__ = (
    #     CheckConstraint('start_time < end_time', name='check_start_before_end'),
    # )