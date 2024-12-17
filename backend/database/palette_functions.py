from sqlalchemy.orm import Session
from database.models import Palette
from datetime import datetime, timezone

def create_palette(session: Session, user_id: int, palette_data: dict):
    palette = Palette(
        user_id=user_id,
        palette_data=palette_data,
        created_at=datetime.now(timezone.utc)
    )
    session.add(palette)
    session.commit()
    return palette

def read_palette(session: Session, palette_id: int):
    return session.query(Palette).filter_by(id=palette_id).first()

def update_palette(session: Session, palette_id: int, **kwargs):
    palette = session.query(Palette).filter_by(id=palette_id).first()
    if not palette:
        return None
    for key, value in kwargs.items():
        if hasattr(palette, key):
            setattr(palette, key, value)
    session.commit()
    return palette

def delete_palette(session: Session, palette_id: int):
    palette = session.query(Palette).filter_by(id=palette_id).first()
    if palette:
        session.delete(palette)
        session.commit()
        return True
    return False
