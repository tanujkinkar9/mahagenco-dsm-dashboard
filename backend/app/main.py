from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import engine, Base, get_db
from app import models, schemas
from datetime import datetime

app = FastAPI(title="MAHAGENCO DSM Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Backend running"}

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

@app.post("/api/plants", response_model=schemas.PlantResponse)
def create_plant(plant: schemas.PlantCreate, db: Session = Depends(get_db)):
    new_plant = models.Plant(name=plant.name, location=plant.location)
    db.add(new_plant)
    db.commit()
    db.refresh(new_plant)
    return new_plant

@app.get("/api/plants", response_model=list[schemas.PlantResponse])
def get_plants(db: Session = Depends(get_db)):
    return db.query(models.Plant).all()

@app.post("/api/data", response_model=schemas.ReadingResponse)
def add_reading(reading: schemas.ReadingCreate, db: Session = Depends(get_db)):
    new_reading = models.Reading(
        plant_id=reading.plant_id,
        frequency=reading.frequency,
        voltage=reading.voltage,
        power=reading.power,
    )
    db.add(new_reading)
    db.commit()
    db.refresh(new_reading)
    return new_reading

@app.get("/api/latest", response_model=list[schemas.ReadingResponse])
def get_latest(db: Session = Depends(get_db)):
    readings = db.query(models.Reading).order_by(models.Reading.timestamp.desc()).limit(10).all()
    return readings

@app.post("/api/schedule", response_model=schemas.ScheduleResponse)
def set_schedule(schedule: schemas.ScheduleCreate, db: Session = Depends(get_db)):
    new_schedule = models.Schedule(
        plant_id=schedule.plant_id,
        scheduled_power=schedule.scheduled_power,
    )
    db.add(new_schedule)
    db.commit()
    db.refresh(new_schedule)
    return new_schedule


@app.get("/api/schedule/{plant_id}", response_model=schemas.ScheduleResponse)
def get_latest_schedule(plant_id: int, db: Session = Depends(get_db)):
    schedule = (
        db.query(models.Schedule)
        .filter(models.Schedule.plant_id == plant_id)
        .order_by(models.Schedule.created_at.desc())
        .first()
    )
    return schedule


def calculate_penalty(scheduled: float, actual: float):
    deviation_mw = actual - scheduled
    deviation_percent = (deviation_mw / scheduled) * 100 if scheduled != 0 else 0
    abs_dev_percent = abs(deviation_percent)

    if abs_dev_percent <= 5:
        penalty = 0
        status = "Normal"
    elif abs_dev_percent <= 15:
        penalty = abs(deviation_mw) * 2000
        status = "Warning"
    else:
        penalty = abs(deviation_mw) * 5000
        status = "Critical"

    return round(deviation_percent, 2), round(penalty, 2), status


@app.get("/api/deviation/{plant_id}", response_model=schemas.DeviationResponse)
def get_deviation(plant_id: int, db: Session = Depends(get_db)):
    plant = db.query(models.Plant).filter(models.Plant.id == plant_id).first()

    schedule = (
        db.query(models.Schedule)
        .filter(models.Schedule.plant_id == plant_id)
        .order_by(models.Schedule.created_at.desc())
        .first()
    )

    latest_reading = (
        db.query(models.Reading)
        .filter(models.Reading.plant_id == plant_id)
        .order_by(models.Reading.timestamp.desc())
        .first()
    )

    scheduled_power = schedule.scheduled_power if schedule else 0
    actual_power = latest_reading.power if latest_reading else 0

    deviation_percent, penalty, status = calculate_penalty(scheduled_power, actual_power)

    return {
        "plant_id": plant_id,
        "plant_name": plant.name if plant else "Unknown",
        "scheduled_power": scheduled_power,
        "actual_power": actual_power,
        "deviation_percent": deviation_percent,
        "penalty_amount": penalty,
        "status": status,
    }