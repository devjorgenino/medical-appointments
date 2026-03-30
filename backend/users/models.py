from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from crypt import get_password_hash

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    nombre = Column(String)
    apellido = Column(String)
    numero_telefono = Column(String, nullable=True)
    direccion = Column(String, nullable=True)
    sexo = Column(String, nullable=True)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    role = relationship("Role", back_populates="users")
    doctor_user = relationship("Doctor", back_populates="user", uselist=False, cascade="all, delete-orphan")
    patient_user = relationship("Patient", back_populates="user", uselist=False, cascade="all, delete-orphan")

    @property
    def password(self):
        raise AttributeError("Password is not accessible directly. Use a method to verify password.")
    
    @password.setter
    def password(self, value):
        self.hashed_password = get_password_hash(value)

