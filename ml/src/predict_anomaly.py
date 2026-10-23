import joblib
import pandas as pd

MODEL_FILE = "models/isolation_forest.joblib"
SCALER_FILE = "models/scaler.joblib"

FEATURES = [
    "total_events",
    "unique_sensors",
    "on_events",
    "off_events",
    "night_events",
    "active_hours",
    "events_per_active_hour",
    "is_weekend"
]

model = joblib.load(MODEL_FILE)
scaler = joblib.load(SCALER_FILE)


def predict_anomaly(activity):
    """
    activity must contain every feature listed in FEATURES.
    Values here are illustrative sensor counts, not medical thresholds.
    """
    row = pd.DataFrame([activity], columns=FEATURES)
    scaled = scaler.transform(row)

    prediction = model.predict(scaled)[0]
    score = -model.score_samples(scaled)[0]

    return {
        "is_anomaly": bool(prediction == -1),
        "anomaly_score": round(float(score), 4)
    }


if __name__ == "__main__":
    sample = {
        "total_events": 10,
        "unique_sensors": 3,
        "on_events": 5,
        "off_events": 5,
        "night_events": 0,
        "active_hours": 2,
        "events_per_active_hour": 5,
        "is_weekend": 0
    }

    print(predict_anomaly(sample))