import os
import pandas as pd

INPUT_FILE = "data/processed/casas_events.csv"
OUTPUT_FILE = "data/processed/daily_features.csv"

print("Loading CASAS data...")

df = pd.read_csv(INPUT_FILE)

df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
df = df.dropna(subset=["timestamp"])

df["date"] = df["timestamp"].dt.date
df["hour"] = df["timestamp"].dt.hour

# Basic event types
df["is_on"] = df["value"].astype(str).str.upper().eq("ON").astype(int)
df["is_off"] = df["value"].astype(str).str.upper().eq("OFF").astype(int)

# Night-time activity
df["is_night"] = (
    (df["hour"] < 6) | (df["hour"] >= 23)
).astype(int)

print(f"Total events: {len(df):,}")

print("Creating daily features...")

daily = (
    df.groupby(["home", "date"])
    .agg(
        total_events=("sensor", "count"),
        unique_sensors=("sensor", "nunique"),
        on_events=("is_on", "sum"),
        off_events=("is_off", "sum"),
        night_events=("is_night", "sum"),
        active_hours=("hour", "nunique"),
    )
    .reset_index()
)

# Average activity per active hour
daily["events_per_active_hour"] = (
    daily["total_events"] /
    daily["active_hours"].replace(0, 1)
)

# Day of week
daily["date"] = pd.to_datetime(daily["date"])
daily["day_of_week"] = daily["date"].dt.dayofweek

# Weekend indicator
daily["is_weekend"] = (
    daily["day_of_week"] >= 5
).astype(int)

daily = daily.sort_values(["home", "date"])

os.makedirs(
    os.path.dirname(OUTPUT_FILE),
    exist_ok=True
)

daily.to_csv(
    OUTPUT_FILE,
    index=False
)

print("\nFeature engineering complete!")
print(f"Days generated: {len(daily):,}")
print(f"Saved to: {OUTPUT_FILE}")

print("\nFeatures:")
print(daily.columns.tolist())

print("\nSample:")
print(daily.head(10).to_string(index=False))