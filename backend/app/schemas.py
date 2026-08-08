from pydantic import BaseModel
from datetime import datetime


class ReadingCreate(BaseModel):
    plant_id: int
    frequency: float
    voltage: float
    power: float


class ReadingResponse(BaseModel):
    id: int
    plant_id: int
    frequency: float
    voltage: float
    power: float
    timestamp: datetime

    class Config:
        from_attributes = True


class PlantCreate(BaseModel):
    name: str
    location: str | None = None


class PlantResponse(BaseModel):
    id: int
    name: str
    location: str | None = None

    class Config:
        from_attributes = True

class ScheduleCreate(BaseModel):
    plant_id: int
    scheduled_power: float

class ScheduleResponse(BaseModel):
    id: int
    plant_id: int
    scheduled_power: float
    created_at: datetime

    class Config:
        from_attributes = True

class DeviationResponse(BaseModel):
    plant_id: int
    plant_name: str
    scheduled_power: float
    actual_power: float
    deviation_percent: float
    penalty_amount: float
    status: str

class DailyGenerationResponse(BaseModel):
    date: datetime
    plant_code: str
    plant_name: str
    generation_mwh: float
    aux_consumption_mwh: float
    plf_percent: float
    dsm_target: float
    dsm_achieved: float
    deviation_percent: float
    penalty_amount: float
    status: str

class UserCreate(BaseModel):
    employee_id: str
    name: str
    password: str
    role: str = "Viewer"

class UserLogin(BaseModel):
    employee_id: str
    password: str

class UserResponse(BaseModel):
    id: int
    employee_id: str
    name: str
    role: str

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse