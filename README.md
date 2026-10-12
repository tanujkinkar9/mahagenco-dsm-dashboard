# MAHAGENCO DSM Dashboard

A real-time Demand Side Management (DSM) monitoring dashboard for power plant generation tracking, deviation analysis, and penalty calculation — built as a working prototype for centralized DSM monitoring.

## Overview

This project simulates and visualizes the DSM process used by power grid operators:
- Plants report live generation data (frequency, voltage, power)
- The system compares actual generation against scheduled generation
- Deviation percentage and penalty amounts are calculated automatically based on grid compliance bands

## Tech Stack

**Backend**
- FastAPI (Python) — REST API
- SQLAlchemy — ORM
- MySQL — database
- Uvicorn — ASGI server

**Frontend**
- React (Vite)
- React Router — multi-page navigation
- Lucide React — icons

**Simulator**
- Python script generating realistic live sensor data every 2 seconds

## Architecture

Sensor Simulator (Python) → FastAPI Backend → MySQL Database → React Dashboard


1. **Simulator** sends random realistic readings (frequency, voltage, power) to the backend every 2 seconds.
2. **Backend** validates and stores readings, and exposes REST endpoints for plants, readings, schedules, and deviation/penalty calculations.
3. **Database** stores Plants, Sensors, Readings, and Schedules.
4. **Frontend** polls the backend every 2 seconds and displays live data, plant details, and DSM penalty status.

## Features

- Live telemetry dashboard with auto-refresh
- Plant list and individual plant detail pages
- DSM deviation and penalty calculation engine:
  - `< 5%` deviation → Normal (no penalty)
  - `5%–15%` deviation → Warning (₹2000/MW penalty)
  - `> 15%` deviation → Critical (₹5000/MW penalty)
- REST API with interactive Swagger docs (`/docs`)

## Project Structure

mahagenco-dsm-dashboard/
├── backend/
│ ├── app/
│ │ ├── main.py # API endpoints
│ │ ├── models.py # SQLAlchemy models
│ │ ├── schemas.py # Pydantic schemas
│ │ └── database.py # DB connection
│ ├── simulator.py # Sensor data simulator
│ └── requirements.txt
├── frontend/
│ ├── src/
│ │ ├── components/ # Layout, shared UI
│ │ ├── pages/ # Dashboard, Plants, PlantDetail
│ │ └── App.jsx
│ └── package.json
└── README.md


## Setup Instructions

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

DATABASE_URL=mysql+pymysql://root:@localhost:3306/mahagenco_dsm


Run the server:
```bash
uvicorn app.main:app --reload
```

API docs available at: `http://127.0.0.1:8000/docs`

### Simulator

```bash
cd backend
venv\Scripts\activate
python simulator.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at: `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/plants` | Create a plant |
| GET | `/api/plants` | List all plants |
| POST | `/api/data` | Submit a sensor reading |
| GET | `/api/latest` | Get latest 10 readings |
| POST | `/api/schedule` | Set scheduled generation for a plant |
| GET | `/api/schedule/{plant_id}` | Get latest schedule for a plant |
| GET | `/api/deviation/{plant_id}` | Get deviation % and penalty for a plant |

## Status

Completed
