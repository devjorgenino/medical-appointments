from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from .models import ActionToken
from users.models import User
from crypt import get_password_hash

def create_action_token(db: Session, user_id: int):
    token = ActionToken.generate_token()  # Assuming generate_token is a method to create a unique token
    expiration = datetime.utcnow() + timedelta(hours=1)  # Token valid for 1 hour

    action_token = ActionToken(token=token, user_id=user_id, expiration=expiration)

    db.add(action_token)
    db.commit()
    db.refresh(action_token)

    return action_token

def get_action_token(db: Session, token: str, is_used: bool = False):
    return db.query(ActionToken).filter(ActionToken.token == token).filter(ActionToken.is_used == is_used).first()

def restore_password(db: Session, token: str, new_password: str):
    action_token = get_action_token(db, token)
    if not action_token or action_token.is_used or action_token.expiration < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(User).filter(User.id == action_token.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = new_password  # Assuming get_password_hash is a utility function to hash passwords
    action_token.is_used = True  # Mark the token as used

    db.commit()
    return {"message": "Password has been reset successfully"}

