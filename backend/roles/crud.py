from sqlalchemy.orm import Session
from .models import Role
from .schemas import RoleCreate

def get_role_by_name(db: Session, name: str):
    return db.query(Role).filter(Role.name == name).first()

def get_role_by_id(db: Session, role_id: int):
    return db.query(Role).filter(Role.id == role_id).first()

def get_roles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Role).offset(skip).limit(limit).all()

def create_role(db: Session, role: RoleCreate):
    db_role = Role(name=role.name, description=role.description)
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

def update_role(db: Session, role_id: int, role: RoleCreate):
    db_role = get_role_by_id(db, role_id)
    if db_role:
        db_role.name = role.name
        db_role.description = role.description
        db.commit()
        db.refresh(db_role)
    return db_role

def delete_role(db: Session, role_id: int):
    db_role = get_role_by_id(db, role_id)
    if db_role:
        db.delete(db_role)
        db.commit()
    return None