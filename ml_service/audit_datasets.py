import os
import pandas as pd
import numpy as np

base_dir = r"f:\dem-evol\COGNYX\dataset"
d1_path = os.path.join(base_dir, "Alzheimer_Dataset_Details.csv")
d2_path = os.path.join(base_dir, "dementia_dataset.csv")
d3_path = os.path.join(base_dir, "OPTIMAL_combined_3studies_6feb2020-selected-columns.csv")

print("="*70)
print("DATASET 1: Alzheimer_Dataset_Details.csv (Image Metadata)")
print("="*70)
if os.path.exists(d1_path):
    df1 = pd.read_csv(d1_path)
    print(f"Shape: {df1.shape} (Rows: {df1.shape[0]}, Cols: {df1.shape[1]})")
    print("Columns & Dtypes:")
    for col in df1.columns:
        print(f"  - {col}: dtype={df1[col].dtype}, Missing={df1[col].isnull().sum()}, Unique={df1[col].nunique()}")
    print("\nValue counts for Disease (Label):")
    print(df1['Disease'].value_counts(dropna=False))
    print("\nValue counts for Split:")
    print(df1['Split'].value_counts(dropna=False))
    print("\nDisease by Split:")
    print(pd.crosstab(df1['Split'], df1['Disease']))
    print(f"Duplicate rows: {df1.duplicated().sum()}")

print("\n" + "="*70)
print("DATASET 2: dementia_dataset.csv (OASIS-2 Longitudinal MRI / Clinical)")
print("="*70)
if os.path.exists(d2_path):
    df2 = pd.read_csv(d2_path)
    print(f"Shape: {df2.shape} (Rows: {df2.shape[0]}, Cols: {df2.shape[1]})")
    print("Columns & Dtypes:")
    for col in df2.columns:
        print(f"  - {col}: dtype={df2[col].dtype}, Missing={df2[col].isnull().sum()}, Unique={df2[col].nunique()}")
    print("\nValue counts for Group (Label):")
    print(df2['Group'].value_counts(dropna=False))
    print("\nValue counts for CDR:")
    print(df2['CDR'].value_counts(dropna=False))
    print("\nGender (M/F):")
    print(df2['M/F'].value_counts(dropna=False))
    print("\nAge stats:")
    print(df2['Age'].describe())
    print("\nMMSE stats:")
    print(df2['MMSE'].describe())
    print(f"\nUnique Subjects: {df2['Subject ID'].nunique()} out of {len(df2)} rows")
    subject_counts = df2['Subject ID'].value_counts()
    print(f"Visits per subject: {dict(subject_counts.value_counts())}")
    print(f"Duplicate rows: {df2.duplicated().sum()}")

print("\n" + "="*70)
print("DATASET 3: OPTIMAL_combined_3studies_6feb2020-selected-columns.csv (Cognitive Domains)")
print("="*70)
if os.path.exists(d3_path):
    df3 = pd.read_csv(d3_path, na_values=['NA', 'NaN', ''])
    print(f"Shape: {df3.shape} (Rows: {df3.shape[0]}, Cols: {df3.shape[1]})")
    print("Columns & Dtypes & Missing values:")
    for col in df3.columns:
        print(f"  - {col}: dtype={df3[col].dtype}, Missing={df3[col].isna().sum()} ({df3[col].isna().mean()*100:.1f}%), Unique={df3[col].nunique()}")
    
    print("\nValue counts for dementia (target):")
    print(df3['dementia'].value_counts(dropna=False))
    print("\nValue counts for dementia_all:")
    print(df3['dementia_all'].value_counts(dropna=False))
    print("\nValue counts for gender:")
    print(df3['gender'].value_counts(dropna=False))
    print("\nValue counts for diabetes:")
    print(df3['diabetes'].value_counts(dropna=False))
    
    print(f"\nUnique IDs: {df3['ID'].nunique()} out of {len(df3)} rows")
    id_counts = df3['ID'].value_counts()
    print(f"IDs appearing more than once: {(id_counts > 1).sum()}")
    print("Sample repeated IDs:", id_counts[id_counts > 1].head(10).to_dict())
    
    print("\nDescriptive statistics for numeric variables:")
    print(df3[['age', 'educationyears', 'EF', 'PS', 'Global']].describe())

    print("\nCrosstab: dementia vs dementia_all:")
    print(pd.crosstab(df3['dementia'].fillna(-1), df3['dementia_all'].fillna(-1)))
    
    print("\nCrosstab: dementia by gender:")
    print(pd.crosstab(df3['gender'], df3['dementia_all'], dropna=False))
    
    print("\nDuplicate full rows:", df3.duplicated().sum())

print("\n" + "="*70)
print("DATASET 4: s41598-024-64438-1.pdf (Scientific Publication / Literature)")
print("="*70)
print("Type: Scientific Article (PDF format, Nature Scientific Reports 2024)")
print("Title: Multimodal deep learning for dementia classification using text and audio")
print("Authors: Kaiying Lin & Peter Y. Washington")
print("Data Source: Pitt Cookie Theft dataset from DementiaBank")
print("Total datapoints (sentences): 9,447 (Control: 5,574, Dementia: 3,873)")
print("Modalities: Audio (Wav2vec), Text (Word2vec 300d embeddings), Timestamps")
