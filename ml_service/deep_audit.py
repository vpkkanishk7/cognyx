import os
import pandas as pd
import numpy as np

base_dir = r"f:\dem-evol\COGNYX\dataset"
d1_path = os.path.join(base_dir, "Alzheimer_Dataset_Details.csv")
d2_path = os.path.join(base_dir, "dementia_dataset.csv")
d3_path = os.path.join(base_dir, "OPTIMAL_combined_3studies_6feb2020-selected-columns.csv")

df1 = pd.read_csv(d1_path)
df2 = pd.read_csv(d2_path)
df3 = pd.read_csv(d3_path, na_values=['NA', 'NaN', ''])

print("--- DATASET 1 STATS ---")
print("Total rows:", len(df1))
print("Diseases:", df1['Disease'].value_counts().to_dict())
print("Splits:", df1['Split'].value_counts().to_dict())

print("\n--- DATASET 2 STATS ---")
print("Total rows:", len(df2))
print("Unique subjects:", df2['Subject ID'].nunique())
print("Groups:", df2['Group'].value_counts().to_dict())
print("CDR values:", df2['CDR'].value_counts().to_dict())
print("Missing per column:\n", df2.isnull().sum().to_dict())

print("\n--- DATASET 3 STATS ---")
print("Total rows:", len(df3))
print("Unique IDs:", df3['ID'].nunique())
print("dementia_all counts:", df3['dementia_all'].value_counts().to_dict())
print("dementia counts:", df3['dementia'].value_counts(dropna=False).to_dict())
print("Missing per column:\n", df3.isnull().sum().to_dict())

# Correlation with dementia_all in Dataset 3
numeric_cols = ['age', 'educationyears', 'EF', 'PS', 'Global', 'diabetes', 'dementia_all']
corr = df3[numeric_cols].corr()['dementia_all'].sort_values()
print("\nCorrelation with dementia_all in Dataset 3:\n", corr)

# Check Dataset 2 correlations
df2_num = df2.copy()
df2_num['is_demented'] = df2_num['Group'].apply(lambda x: 1 if x in ['Demented', 'Converted'] else 0)
num_cols_2 = ['Age', 'EDUC', 'SES', 'MMSE', 'CDR', 'eTIV', 'nWBV', 'ASF', 'is_demented']
print("\nCorrelation with is_demented in Dataset 2:\n", df2_num[num_cols_2].corr()['is_demented'].sort_values())
