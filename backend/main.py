from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import engine, Base, get_db
from app import models, schemas

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

@app.get("/api/alerts")
def get_alerts(limit: int = 20, db: Session = Depends(get_db)):
    records = (
        db.query(models.DailyGeneration)
        .order_by(models.DailyGeneration.date.desc())
        .limit(300)
        .all()
    )

    alerts = []
    for r in records:
        deviation_percent, penalty, status = calculate_penalty(r.dsm_target, r.dsm_achieved)
        if status in ("Warning", "Critical"):
            alerts.append({
                "date": r.date,
                "plant_name": r.plant_name,
                "deviation_percent": deviation_percent,
                "penalty_amount": penalty,
                "status": status,
                "message": f"{r.plant_name} deviated {deviation_percent}% from schedule ({r.dsm_target} MW target, {r.dsm_achieved} MW achieved).",
            })
        if len(alerts) >= limit:
            break

    return alerts

@app.get("/api/users", response_model=list[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()