from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from database import Base

class ActionToken(Base):
    __tablename__ = "action_tokens"
    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_used = Column(Boolean, default=False)
    expiration = Column(DateTime, nullable=False)

    @classmethod
    def generate_token(cls):
        import secrets
        return secrets.token_urlsafe(32)
