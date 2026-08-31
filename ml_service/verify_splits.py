import os
import pandas as pd
import numpy as np
from sklearn.model_selection import GroupShuffleSplit

base_dir = r"f:\dem-evol\COGNYX\dataset"
d3_path = os.path.join(base_dir, "OPTIMAL_combined_3studies_6feb2020-selected-columns.csv")

df3 = pd.read_csv(d3_path, na_values=['NA', 'NaN', ''])

print("Total rows in Dataset 3:", len(df3))
print("Total unique participant IDs:", df3['ID'].nunique())

# Exact features:
features = ['age', 'gender', 'educationyears', 'EF', 'PS', 'Global', 'diabetes']
target = 'dementia_all'

# Missingness in features & target
print("\nFeature Missingness:")
for f in features + [target]:
    n_miss = df3[f].isna().sum()
    pct = n_miss / len(df3) * 100
    print(f"  {f}: {n_miss} ({pct:.2f}%)")

# Participant-level split: 70% Train, 15% Val, 15% Test
# Step 1: Split 70% Train vs 30% Temp (Val + Test) grouped by ID
gss1 = GroupShuffleSplit(n_splits=1, train_size=0.70, random_state=42)
train_idx, temp_idx = next(gss1.split(df3, df3[target], groups=df3['ID']))

train_df = df3.iloc[train_idx]
temp_df = df3.iloc[temp_idx]

# Step 2: Split Temp into 50% Val, 50% Test (each is 15% of total) grouped by ID
gss2 = GroupShuffleSplit(n_splits=1, train_size=0.50, random_state=42)
val_sub_idx, test_sub_idx = next(gss2.split(temp_df, temp_df[target], groups=temp_df['ID']))

val_df = temp_df.iloc[val_sub_idx]
test_df = temp_df.iloc[test_sub_idx]

print("\n--- EXACT SPLIT COUNTS ---")
print(f"Train Set: {len(train_df)} rows, {train_df['ID'].nunique()} unique participants")
print(f"  Class 0 (Control): {(train_df[target] == 0).sum()} ({((train_df[target] == 0).mean()*100):.1f}%)")
print(f"  Class 1 (Dementia): {(train_df[target] == 1).sum()} ({((train_df[target] == 1).mean()*100):.1f}%)")

print(f"\nValidation Set: {len(val_df)} rows, {val_df['ID'].nunique()} unique participants")
print(f"  Class 0 (Control): {(val_df[target] == 0).sum()} ({((val_df[target] == 0).mean()*100):.1f}%)")
print(f"  Class 1 (Dementia): {(val_df[target] == 1).sum()} ({((val_df[target] == 1).mean()*100):.1f}%)")

print(f"\nTest Set: {len(test_df)} rows, {test_df['ID'].nunique()} unique participants")
print(f"  Class 0 (Control): {(test_df[target] == 0).sum()} ({((test_df[target] == 0).mean()*100):.1f}%)")
print(f"  Class 1 (Dementia): {(test_df[target] == 1).sum()} ({((test_df[target] == 1).mean()*100):.1f}%)")

# Overlap checks
train_ids = set(train_df['ID'])
val_ids = set(val_df['ID'])
test_ids = set(test_df['ID'])

print("\n--- LEAKAGE VERIFICATION ---")
print(f"Train-Val ID Overlap: {len(train_ids.intersection(val_ids))}")
print(f"Train-Test ID Overlap: {len(train_ids.intersection(test_ids))}")
print(f"Val-Test ID Overlap: {len(val_ids.intersection(test_ids))}")
