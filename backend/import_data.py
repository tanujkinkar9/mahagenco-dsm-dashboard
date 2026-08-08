import openpyxl
from datetime import datetime
from app.database import SessionLocal, engine, Base
from app import models

# Ensure tables exist
Base.metadata.create_all(bind=engine)

db = SessionLocal()

FILE_PATH = "data/MAHAGENCO_PowerBI_Dataset_1Year.xlsx"

wb = openpyxl.load_workbook(FILE_PATH, data_only=True)
ws = wb["Daily_Generation"]

# Step 1: Get unique plants from the sheet and create them if not already present
plant_map = {}  # plant_code -> plant_id

rows = list(ws.iter_rows(min_row=2, values_only=True))
print(f"Total rows found in Excel: {len(rows)}")

unique_plants = {}
for row in rows:
    date, plant_code, plant_name, gen, aux, plf, target, achieved = row
    unique_plants[plant_code] = plant_name

for code, name in unique_plants.items():
    existing = db.query(models.Plant).filter(models.Plant.name == name).first()
    if existing:
        plant_map[code] = existing.id
        print(f"Plant already exists: {name} (id={existing.id})")
    else:
        new_plant = models.Plant(name=name, location="Maharashtra")
        db.add(new_plant)
        db.commit()
        db.refresh(new_plant)
        plant_map[code] = new_plant.id
        print(f"Created plant: {name} (id={new_plant.id})")

# Step 2: Insert daily generation rows
count = 0
for row in rows:
    date, plant_code, plant_name, gen, aux, plf, target, achieved = row

    if isinstance(date, str):
        date = datetime.strptime(date, "%Y-%m-%d")

    record = models.DailyGeneration(
        date=date,
        plant_code=plant_code,
        plant_name=plant_name,
        generation_mwh=gen,
        aux_consumption_mwh=aux,
        plf_percent=plf,
        dsm_target=target,
        dsm_achieved=achieved,
    )
    db.add(record)
    count += 1

    if count % 500 == 0:
        db.commit()
        print(f"Inserted {count} rows...")

db.commit()
print(f"Done! Total rows inserted: {count}")
db.close()
