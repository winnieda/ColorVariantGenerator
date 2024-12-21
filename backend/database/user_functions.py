from sqlalchemy.orm import Session
from database.models import User
from datetime import datetime, timezone

def create_user(session: Session, username: str, password_hash: str, email: str = None, confirmation_code: str = None):
    user = User(
        username=username,
        password_hash=password_hash,
        email=email,
        created_at=datetime.now(timezone.utc),
        confirmation_code=confirmation_code
    )
    session.add(user)
    session.commit()
    return user

def read_user(session: Session, user_id: int):
    return session.query(User).filter_by(id=user_id).first()

def update_user(session: Session, user_id: int, **kwargs):
    user = session.query(User).filter_by(id=user_id).first()
    if not user:
        return None
    for key, value in kwargs.items():
        if hasattr(user, key):
            setattr(user, key, value)
    session.commit()
    return user

def delete_user(session: Session, user_id: int):
    user = session.query(User).filter_by(id=user_id).first()
    if user:
        session.delete(user)
        session.commit()
        return True
    return False
