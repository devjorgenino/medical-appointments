from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from database import SessionLocal
from .models import Role
from .schemas import Role, RoleCreate
from .crud import get_role_by_name, get_roles, create_role, update_role, delete_role, get_role_by_id
from users.models import User
from auth.routes import get_current_user

router = APIRouter(
    prefix="/roles",
    tags=["roles"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[Role])
async def read_roles(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role_id != 1:  
        raise HTTPException(status_code=403, detail="Not authorized")
    return get_roles(db)

@router.post("/", response_model=Role, status_code=status.HTTP_201_CREATED)
async def create_role_endpoint(role: RoleCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role_id != 1:  
        raise HTTPException(status_code=403, detail="Not authorized")
    db_role = get_role_by_name(db, name=role.name)
    if db_role:
        raise HTTPException(status_code=400, detail="Role name already exists")
    return create_role(db, role)

@router.put("/{role_id}", response_model=Role)
async def update_role_endpoint(role_id: int, role_data: RoleCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role_id != 1:  
        raise HTTPException(status_code=403, detail="Not authorized")
    db_role = get_role_by_id(db, role_id=role_id)
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")
    return update_role(db, role_id, role_data)

@router.delete("/{role_id}")
async def delete_role_endpoint(role_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role_id != 1: 
        raise HTTPException(status_code=403, detail="Not authorized")
    db_role = get_role_by_id(db, role_id=role_id)
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")
    delete_role(db, role_id)
    return {"message": "Role deleted"}
