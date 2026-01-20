import pandas as pd
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

# Collect all CSV files
csv_files = list(Path('assets/datasets').rglob('*.csv'))

# Read all biometric files
print("Reading biometric data...")
bio_files = [f for f in csv_files if 'biometric' in f.name]
bio_dfs = [pd.read_csv(f) for f in sorted(bio_files)]
bio_df = pd.concat(bio_dfs, ignore_index=True)
print(f"Total biometric records: {len(bio_df)}")

# Read all demographic files
print("Reading demographic data...")
demo_files = [f for f in csv_files if 'demographic' in f.name]
demo_dfs = [pd.read_csv(f) for f in sorted(demo_files)]
demo_df = pd.concat(demo_dfs, ignore_index=True)
print(f"Total demographic records: {len(demo_df)}")

# Read all enrolment files
print("Reading enrolment data...")
enrol_files = [f for f in csv_files if 'enrolment' in f.name]
enrol_dfs = [pd.read_csv(f) for f in sorted(enrol_files)]
enrol_df = pd.concat(enrol_dfs, ignore_index=True)
print(f"Total enrolment records: {len(enrol_df)}")

# ===== ANALYSIS =====
print("\n" + "="*60)
print("ENROLMENT AGE DISTRIBUTION (Primary Data)")
print("="*60)
total_enrol = len(enrol_df)
age_0_5 = enrol_df['age_0_5'].sum()
age_5_17 = enrol_df['age_5_17'].sum()
age_18_plus = enrol_df['age_18_greater'].sum()
total_age = age_0_5 + age_5_17 + age_18_plus

print(f"Age 0-5: {age_0_5:,} ({age_0_5*100/total_age:.1f}%)")
print(f"Age 5-17: {age_5_17:,} ({age_5_17*100/total_age:.1f}%)")
print(f"Age 18+: {age_18_plus:,} ({age_18_plus*100/total_age:.1f}%)")
print(f"Total: {total_age:,}")

# State-level analysis
print("\n" + "="*60)
print("TOP STATES BY ENROLMENT")
print("="*60)
state_enrol = enrol_df.groupby('state')[['age_0_5', 'age_5_17', 'age_18_greater']].sum()
state_enrol['total'] = state_enrol.sum(axis=1)

print("\nTop 15 states by Total Enrolment:")
top_states = state_enrol.nlargest(15, 'total')
for idx, (state, row) in enumerate(top_states.iterrows(), 1):
    print(f"{idx:2}. {state:20} - Total: {int(row['total']):8,} | 0-5: {int(row['age_0_5']):6,} | 5-17: {int(row['age_5_17']):7,} | 18+: {int(row['age_18_greater']):6,}")

# Monthly trend
print("\n" + "="*60)
print("MONTHLY ENROLMENT TREND")
print("="*60)
enrol_df['date'] = pd.to_datetime(enrol_df['date'], errors='coerce')
enrol_df['month'] = enrol_df['date'].dt.strftime('%b')
monthly = enrol_df.groupby(enrol_df['date'].dt.strftime('%m-%b'))[['age_0_5', 'age_5_17', 'age_18_greater']].sum()
monthly['total'] = monthly.sum(axis=1)
print(monthly)

# Biometric state analysis
print("\n" + "="*60)
print("TOP 10 STATES BY BIOMETRIC LOAD")
print("="*60)
bio_state = bio_df.groupby('state')[['bio_age_5_17', 'bio_age_17_']].sum()
bio_state['total'] = bio_state.sum(axis=1)
top_bio = bio_state.nlargest(10, 'total')
for idx, (state, row) in enumerate(top_bio.iterrows(), 1):
    print(f"{idx:2}. {state:20} - {int(row['total']):10,} | Age 5-17: {int(row['bio_age_5_17']):8,} | Age 17+: {int(row['bio_age_17_']):8,}")

# Demographics state analysis
print("\n" + "="*60)
print("TOP 10 STATES BY DEMOGRAPHIC")
print("="*60)
demo_state = demo_df.groupby('state')[['demo_age_5_17', 'demo_age_17_']].sum()
demo_state['total'] = demo_state.sum(axis=1)
top_demo = demo_state.nlargest(10, 'total')
for idx, (state, row) in enumerate(top_demo.iterrows(), 1):
    print(f"{idx:2}. {state:20} - {int(row['total']):10,} | Age 5-17: {int(row['demo_age_5_17']):8,} | Age 17+: {int(row['demo_age_17_']):8,}")

print("\n" + "="*60)
print("CHART DATA FOR app.js")
print("="*60)

# Seasonal chart data (monthly average)
print("\nSeasonal Chart (Monthly Enrolments in thousands):")
monthly_thousands = (monthly['total'] / 1000).round(0).astype(int)
print(list(monthly_thousands.head(9)))

# Youth concentration by top 5 states
print("\nYouth Concentration (Top 5 states by age_5_17):")
youth_by_state = enrol_df.groupby('state')[['age_0_5', 'age_5_17', 'age_18_greater']].sum()
youth_by_state['youth_pct'] = (youth_by_state['age_5_17'] / youth_by_state.sum(axis=1) * 100).round(1)
top_youth = youth_by_state.nlargest(5, 'age_5_17')
for state in top_youth.index:
    print(f"  '{state}': {top_youth.loc[state, 'youth_pct']}")

# Biometric stress by top 5
print("\nBiometric Stress (Top 5 states):")
for state in top_bio.head(5).index:
    print(f"  '{state}': {int(bio_state.loc[state, 'total'])}")
