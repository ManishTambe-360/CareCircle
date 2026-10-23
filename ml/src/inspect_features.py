import pandas as pd

FILE = "data/processed/daily_features.csv"

df = pd.read_csv(FILE)

print("\nShape:")
print(df.shape)

print("\nColumns:")
print(df.columns.tolist())

print("\nMissing values:")
print(df.isnull().sum())

print("\nStatistics:")
print(df.describe())

print("\nHomes:")
print(df["home"].value_counts())

print("\nSample:")
print(df.head(10).to_string(index=False))