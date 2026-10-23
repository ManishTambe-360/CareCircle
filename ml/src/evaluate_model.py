import pandas as pd

FILE = "data/processed/anomaly_results.csv"

df = pd.read_csv(FILE)

print("\n--- MODEL EVALUATION ---")
print(f"Total daily records: {len(df)}")
print(f"Detected anomalies: {df['is_anomaly'].sum()}")
print(f"Normal records: {(~df['is_anomaly'].astype(bool)).sum()}")
print(f"Anomaly percentage: {df['is_anomaly'].astype(bool).mean() * 100:.2f}%")

print("\n--- Top 15 unusual records ---")

print(
    df.nlargest(15, "anomaly_score")[
        ["home", "date", "total_events", "night_events",
         "active_hours", "anomaly_score", "is_anomaly"]
    ].to_string(index=False)
)

print("\n--- Anomaly counts by home ---")
print(
    df.groupby("home")["is_anomaly"]
    .sum()
    .sort_values(ascending=False)
)