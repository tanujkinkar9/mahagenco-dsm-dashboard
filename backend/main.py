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