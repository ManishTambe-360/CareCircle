
from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from backend.app.database import save_analysis, get_history, get_incidents
from backend.app.explanations import generate_explanation
import pandas as pd
from fastapi import HTTPException


# Locate the project root and saved ML artifacts
ROOT_DIR = Path(__file__).resolve().parents[2]
MODEL_DIR = ROOT_DIR / "ml" / "models"

MODEL_FILE = MODEL_DIR / "isolation_forest.joblib"
SCALER_FILE = MODEL_DIR / "scaler.joblib"

FEATURES = [
    "total_events",
    "unique_sensors",
    "on_events",
    "off_events",
    "night_events",
    "active_hours",
    "events_per_active_hour",
    "is_weekend",
]

# Load the trained model and scaler
model = joblib.load(MODEL_FILE)
scaler = joblib.load(SCALER_FILE)

app = FastAPI(title="CareCircle AI API", version="1.0.0")

# Allow requests from the local React development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class ActivityInput(BaseModel):
    total_events: int = Field(ge=0)
    unique_sensors: int = Field(ge=0)
    on_events: int = Field(ge=0)
    off_events: int = Field(ge=0)
    night_events: int = Field(ge=0)
    active_hours: int = Field(ge=0, le=24)
    events_per_active_hour: float = Field(ge=0)
    is_weekend: int = Field(ge=0, le=1)


@app.get("/")
def home():
    return {"message": "CareCircle AI API is running"}


@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": True}


@app.post("/predict")
def predict(activity: ActivityInput):
    row = pd.DataFrame(
        [activity.model_dump()],
        columns=FEATURES,
    )

    scaled_data = scaler.transform(row)
    prediction = int(model.predict(scaled_data)[0])
    score = float(-model.score_samples(scaled_data)[0])

    return {
        "is_anomaly": prediction == -1,
        "anomaly_score": round(score, 4),
        "message": (
            "Unusual activity pattern detected. Consider checking on the resident."
            if prediction == -1
            else "No unusual pattern detected by the current model."
        ),
        "note": "This is an experimental anomaly flag, not a diagnosis or emergency determination.",
    }

@app.get("/demo/normal")
def demo_normal():
    df = pd.read_csv(ROOT_DIR / "ml" / "data" / "processed" / "anomaly_results.csv")

    row = df[df["is_anomaly"] == False].iloc[0]

    data = row[FEATURES].to_dict()

    result = predict(ActivityInput(**data))

    return {
        "activity": data,
        **result
    }


@app.get("/demo/anomaly")
def demo_anomaly():
    df = pd.read_csv(ROOT_DIR / "ml" / "data" / "processed" / "anomaly_results.csv")

    row = df[df["is_anomaly"] == True].iloc[0]

    data = row[FEATURES].to_dict()

    result = predict(ActivityInput(**data))

    return {
        "activity": data,
        **result
    }


@app.post("/analyze/{resident_id}")
def analyze_and_save(resident_id: str, activity: ActivityInput):
    activity_data = activity.model_dump()

    prediction = predict(activity)

    saved_record = save_analysis(
        resident_id=resident_id,
        activity=activity_data,
        prediction=prediction
    )

    explanation = generate_explanation(
        activity=activity_data,
        prediction=prediction
    )

    return {
        **saved_record,
        "ai_analysis": explanation
    }

@app.get("/history")
def activity_history(limit: int = 50):
    limit = max(1, min(limit, 200))
    return {"records": get_history(limit)}


@app.get("/incidents")
def incident_history(limit: int = 50):
    limit = max(1, min(limit, 200))
    return {"incidents": get_incidents(limit)}


@app.get("/demo/sample/{scenario}")
def get_dataset_sample(scenario: str):
    if scenario not in {"normal", "anomaly"}:
        raise HTTPException(
            status_code=400,
            detail="Scenario must be normal or anomaly."
        )

    csv_path = ROOT_DIR / "ml" / "data" / "processed" / "anomaly_results.csv"
    df = pd.read_csv(csv_path)

    expected = scenario == "anomaly"
    candidates = df[df["is_anomaly"].astype(bool) == expected]

    if candidates.empty:
        raise HTTPException(
            status_code=404,
            detail=f"No {scenario} dataset examples found."
        )

    sample = candidates.iloc[0]

    return {
        "home": str(sample["home"]),
        "date": str(sample["date"]),
        "total_events": int(sample["total_events"]),
        "unique_sensors": int(sample["unique_sensors"]),
        "on_events": int(sample["on_events"]),
        "off_events": int(sample["off_events"]),
        "night_events": int(sample["night_events"]),
        "active_hours": int(sample["active_hours"]),
        "events_per_active_hour": float(sample["events_per_active_hour"]),
        "is_weekend": int(sample["is_weekend"]),
        "is_anomaly": bool(sample["is_anomaly"]),
    }
