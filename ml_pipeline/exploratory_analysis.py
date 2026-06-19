import os
import pandas as pd

print("==================================================")
print("     RUNNING EXPLORATORY DATA ANALYSIS (EDA)      ")
print("==================================================\n")

# 1. Load the raw data file
raw_data_path = os.path.join("data", "customer_churn.csv")
if not os.path.exists(raw_data_path):
    raise FileNotFoundError(f"Missing data at {raw_data_path}. Run generate_dataset.py first.")

df = pd.read_csv(raw_data_path)

# 2. Compute Base Churn Rate
total_customers = len(df)
churned_count = df["churn"].sum()
churn_rate = (churned_count / total_customers) * 100

print("--- BASELINE METRICS ---")
print(f"Total Customers Analyzed : {total_customers}")
print(f"Total Churned Customers  : {churned_count}")
print(f"Overall Churn Rate       : {churn_rate:.2f}%\n")

# 3. Behavioral Segment Analysis
# Group features by churn status to compare behavioral averages
print("--- BEHAVIORAL AVERAGES BY CHURN STATUS ---")
numerical_features = ["age", "tenure_months", "monthly_charges", "total_charges", "support_tickets"]
grouped_stats = df.groupby("churn")[numerical_features].mean()
print(grouped_stats.round(2).to_string())
print("\n")

# 4. Categorical Breakdown (Contract Type Impact)
print("--- CHURN RATE BY CONTRACT TYPE ---")
contract_churn = df.groupby("contract_type")["churn"].mean() * 100
print(contract_churn.round(2).to_string() + " (%)")
print("\n")

# 5. Feature Correlation matrix snippet with Churn
print("--- TOP CORRELATIONS WITH TARGET (CHURN) ---")
# Drop text columns for pure mathematical correlation calculation
numeric_df = df.drop(columns=["customer_id", "contract_type"])
correlations = numeric_df.corr()["churn"].sort_values(ascending=False)
print(correlations.to_string())
print("\n==================================================")