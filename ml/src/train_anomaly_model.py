import os
import joblib
import pandas as pd

from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler


INPUT_FILE = "data/processed/daily_features.csv"
MODEL_DIR = "models"

MODEL_FILE = os.path.join(
    MODEL_DIR,
    "isolation_forest.joblib"
)

SCALER_FILE = os.path.join(
    MODEL_DIR,
    "scaler.joblib"
)


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


print("Loading features...")

df = pd.read_csv(INPUT_FILE)

X = df[FEATURES].copy()

X = X.fillna(0)

print(f"Training samples: {len(X):,}")
print(f"Features: {FEATURES}")


print("\nScaling features...")

scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)


print("Training Isolation Forest...")

model = IsolationForest(
    n_estimators=200,
    contamination="auto",
    random_state=42,
    n_jobs=-1
)

model.fit(X_scaled)


# Isolation Forest:
# -1 = anomaly
#  1 = normal

df["prediction"] = model.predict(X_scaled)

df["anomaly_score"] = -model.score_samples(X_scaled)

df["is_anomaly"] = (
    df["prediction"] == -1
)


os.makedirs(MODEL_DIR, exist_ok=True)

joblib.dump(model, MODEL_FILE)
joblib.dump(scaler, SCALER_FILE)

df.to_csv(
    "data/processed/anomaly_results.csv",
    index=False
)


print("\nTraining complete!")

print(f"Model saved: {MODEL_FILE}")
print(f"Scaler saved: {SCALER_FILE}")

print("\nResults:")
print(
    df["is_anomaly"]
    .value_counts()
)

print("\nTop anomalies:")

print(
    df[
        [
            "home",
            "date",
            "anomaly_score",
            "is_anomaly"
        ]
    ]
    .sort_values(
        "anomaly_score",
        ascending=False
    )
    .head(10)
    .to_string(index=False)
)