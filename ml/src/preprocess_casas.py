import os
import glob
import pandas as pd

INPUT_DIR = "data/raw/casas/new_labeled_data"
OUTPUT_DIR = "data/processed"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "casas_events.csv")

os.makedirs(OUTPUT_DIR, exist_ok=True)

all_data = []

files = glob.glob(os.path.join(INPUT_DIR, "*.txt"))

for file in files:
    home = os.path.splitext(os.path.basename(file))[0]

    print(f"Processing: {home}", flush=True)

    rows = []

    with open(file, "r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            parts = line.strip().split()

            if len(parts) < 4:
                continue

            date = parts[0]
            time = parts[1]
            sensor = parts[2]
            value = parts[3]

            activity = " ".join(parts[4:]) if len(parts) > 4 else ""

            rows.append([
                date,
                time,
                sensor,
                value,
                activity,
                home
            ])

    df = pd.DataFrame(
        rows,
        columns=[
            "date",
            "time",
            "sensor",
            "value",
            "activity",
            "home"
        ]
    )

    df["timestamp"] = pd.to_datetime(
        df["date"] + " " + df["time"],
        errors="coerce"
    )

    df = df.dropna(subset=["timestamp"])

    df = df[
        [
            "home",
            "timestamp",
            "sensor",
            "value",
            "activity"
        ]
    ]

    all_data.append(df)

    print(
        f"  Loaded {len(df):,} events",
        flush=True
    )


print("\nCombining datasets...", flush=True)

result = pd.concat(
    all_data,
    ignore_index=True
)

result = result.sort_values(
    ["home", "timestamp"]
)

result.to_csv(
    OUTPUT_FILE,
    index=False
)

print("\nDONE!", flush=True)
print(f"Total events: {len(result):,}")
print(f"Saved to: {OUTPUT_FILE}")
print("\nEvents by home:")
print(result["home"].value_counts())