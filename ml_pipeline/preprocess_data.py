import os
import pandas as pd
from sklearn.model_selection import train_test_split

print("Initializing data preprocessing pipeline...")

# 1. Establish path resolution and load the raw dataset
raw_data_path = os.path.join("data", "customer_churn.csv")
if not os.path.exists(raw_data_path):
    raise FileNotFoundError(f"Raw data file missing at {raw_data_path}. Run generate_dataset.py first.")

df = pd.read_csv(raw_data_path)

# 2. Drop unique row identifiers that add no statistical predictive signal
# Keeping customer_id would cause the model to overfit on noise.
df_cleaned = df.drop(columns=["customer_id"])

# 3. Handle Categorical Columns using One-Hot Encoding
# This converts columns like contract_type ("Month-to-month", "One year", "Two year")
# into separate numerical columns containing 0s and 1s.
df_encoded = pd.get_dummies(df_cleaned, columns=["contract_type"], drop_first=True, dtype=int)

# 4. Feature-Target Separation (Split inputs from output labels)
# X represents our independent feature variables
X = df_encoded.drop(columns=["churn"])
# y represents our dependent target output variable (what we want to predict)
y = df_encoded["churn"]

# 5. Partition data into Training (80%) and Testing (20%) datasets
# random_state ensures the split is identical every time we run this file.
# stratify=y guarantees that the ratio of churned to non-churned users is identical in both splits.
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 6. Securely persist the split processed arrays to the data directory
X_train.to_csv(os.path.join("data", "X_train.csv"), index=False)
X_test.to_csv(os.path.join("data", "X_test.csv"), index=False)
y_train.to_csv(os.path.join("data", "y_train.csv"), index=False)
y_test.to_csv(os.path.join("data", "y_test.csv"), index=False)

print("Data preprocessing complete! Datasets split and successfully saved.")
print(f"Training set dimensions: {X_train.shape}")
print(f"Testing set dimensions: {X_test.shape}")
print("\nSample processed features tracker:")
print(X_train.head(2))