import pandas as pd
import os
import glob

# Define data paths
base_path = "assets/datasets"

# Read and combine all biometric data
biometric_files = glob.glob(os.path.join(base_path, "api_data_aadhar_biometric/api_data_aadhar_biometric/*.csv"))
biometric_df = pd.concat([pd.read_csv(f) for f in biometric_files], ignore_index=True)

# Read and combine all enrollment data
enrollment_files = glob.glob(os.path.join(base_path, "api_data_aadhar_enrolment/api_data_aadhar_enrolment/*.csv"))
enrollment_df = pd.concat([pd.read_csv(f) for f in enrollment_files], ignore_index=True)

# Read and combine all demographic data
demographic_files = glob.glob(os.path.join(base_path, "api_data_aadhar_demographic/api_data_aadhar_demographic/*.csv"))
demographic_df = pd.concat([pd.read_csv(f) for f in demographic_files], ignore_index=True)

print("="*70)
print("AADHAAR DATA ANALYSIS - KEY DISCOVERIES")
print("="*70)

# DISCOVERY 1: Age-wise distribution
print("\n1️⃣ AGE-WISE ENROLLMENT DISTRIBUTION")
print("-" * 70)
enrollment_agg = enrollment_df[['age_0_5', 'age_5_17', 'age_18_greater']].sum()
total_enrollments = enrollment_agg.sum()
print(f"Age 0-5:      {enrollment_agg['age_0_5']:>10,.0f} ({enrollment_agg['age_0_5']/total_enrollments*100:>6.2f}%)")
print(f"Age 5-17:     {enrollment_agg['age_5_17']:>10,.0f} ({enrollment_agg['age_5_17']/total_enrollments*100:>6.2f}%)")
print(f"Age 18+:      {enrollment_agg['age_18_greater']:>10,.0f} ({enrollment_agg['age_18_greater']/total_enrollments*100:>6.2f}%)")
print(f"TOTAL:        {total_enrollments:>10,.0f}")

# DISCOVERY 2: State-wise youth concentration
print("\n2️⃣ STATE-WISE YOUTH CONCENTRATION (Age 5-17)")
print("-" * 70)
state_youth = enrollment_df.groupby('state')[['age_5_17']].sum().sort_values('age_5_17', ascending=False)
print("TOP 10 STATES:")
for state, count in state_youth.head(10).iterrows():
    print(f"  {state:25s}: {count['age_5_17']:>10,.0f}")

# DISCOVERY 3: Biometric age distribution
print("\n3️⃣ BIOMETRIC DATA BY AGE GROUP")
print("-" * 70)
biometric_agg = biometric_df[['bio_age_5_17', 'bio_age_17_']].sum()
print(f"Biometric Age 5-17:   {biometric_agg['bio_age_5_17']:>10,.0f}")
print(f"Biometric Age 17+:    {biometric_agg['bio_age_17_']:>10,.0f}")
print(f"TOTAL:                {biometric_agg.sum():>10,.0f}")

# DISCOVERY 4: State-wise biometric stress
print("\n4️⃣ TOP STATES BY BIOMETRIC LOAD")
print("-" * 70)
state_bio = biometric_df.groupby('state')[['bio_age_5_17', 'bio_age_17_']].sum()
state_bio['total'] = state_bio['bio_age_5_17'] + state_bio['bio_age_17_']
state_bio_sorted = state_bio.sort_values('total', ascending=False)
print("TOP 10 STATES:")
for state in state_bio_sorted.head(10).index:
    total = state_bio_sorted.loc[state, 'total']
    print(f"  {state:25s}: {total:>10,.0f}")

# Calculate ratios for insights
print("\n5️⃣ KEY METRICS & INSIGHTS")
print("-" * 70)
youth_5_17_pct = (enrollment_agg['age_5_17'] / total_enrollments) * 100
print(f"Youth (5-17) represent: {youth_5_17_pct:.2f}% of total enrollments")

biometric_ratio = biometric_agg['bio_age_5_17'] / biometric_agg['bio_age_17_']
print(f"Biometric ratio (5-17 vs 17+): {biometric_ratio:.3f}")

# Monthly trend analysis
enrollment_df['date'] = pd.to_datetime(enrollment_df['date'])
enrollment_df['month'] = enrollment_df['date'].dt.strftime('%B')
monthly_enrollments = enrollment_df.groupby('month')[['age_5_17']].sum().sort_values('age_5_17', ascending=False)
print(f"\nHighest enrollment month (Youth 5-17): {monthly_enrollments.index[0]} with {monthly_enrollments.iloc[0, 0]:,.0f}")

# State variance
state_variance = enrollment_df.groupby('state')[['age_5_17']].sum().std()
state_mean = enrollment_df.groupby('state')[['age_5_17']].sum().mean()
print(f"Youth enrollment variance across states: {state_variance.values[0]:,.0f}")
print(f"Average youth enrollment per state: {state_mean.values[0]:,.0f}")

print("\n" + "="*70)
print("DATA READY FOR VISUALIZATION")
print("="*70)
