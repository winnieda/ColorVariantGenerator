from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime, timezone

# Base class for the ORM models
Base = declarative_base()

class Palette(Base):
    __tablename__ = 'Palettes'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('User.id'), nullable=False)
    palette_data = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationship with user
    user = relationship("User", back_populates="palettes")

    def __repr__(self):
        return f"<Palette(id={self.id}, user_id={self.user_id}, created_at={self.created_at})>"


class User(Base):
    __tablename__ = 'User'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True, unique=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    confirmation_code = Column(String(6), nullable=True)
    is_confirmed = Column(Boolean, default=False, nullable=False)

    # Relationship with palettes
    palettes = relationship("Palette", back_populates="user")

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email})>"