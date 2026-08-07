from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Plant(Base):
    __tablename__ = "plants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    location = Column(String(100), nullable=True)

    sensors = relationship("Sensor", back_populates="plant")
    readings = relationship("Reading", back_populates="plant")


class Sensor(Base):
    __tablename__ = "sensors"

    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=False)
    sensor_type = Column(String(50), nullable=False)

    plant = relationship("Plant", back_populates="sensors")


class Reading(Base):
    __tablename__ = "readings"

    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=False)
    frequency = Column(Float, nullable=False)
    voltage = Column(Float, nullable=False)
    power = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    plant = relationship("Plant", back_populates="readings")

class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=False)
    scheduled_power = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    plant = relationship("Plant")