import os
import glob
import pandas as pd

DATA_DIR = "data/raw/casas"


def inspect_files():
    files = glob.glob(os.path.join(DATA_DIR, "**", "*"), recursive=True)

    files = [
        f for f in files
        if os.path.isfile(f) and f.lower().endswith((".csv", ".txt"))
    ]

    print(f"\nFound {len(files)} data files.\n")

    for file in files[:10]:
        print("=" * 70)
        print("FILE:", file)

        try:
            df = pd.read_csv(file)

            print("\nColumns:")
            print(df.columns.tolist())

            print("\nShape:")
            print(df.shape)

            print("\nFirst 5 rows:")
            print(df.head())

        except Exception as e:
            print("Could not read:", e)


if __name__ == "__main__":
    inspect_files()