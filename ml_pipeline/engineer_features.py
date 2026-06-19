import os
import pandas as pd

print("Initializing feature engineering pipeline...")

# 1. Define paths for the split partitions
train_path = os.path.join("data", "X_train.csv")
test_path = os.path.join("data", "X_test.csv")

if not os.path.exists(train_path) or not os.path.exists(test_path):
    raise FileNotFoundError("Split data files are missing. Run preprocess_data.py first.")

X_train = pd.read_csv(train_path)
X_test = pd.read_csv(test_path)

# 2. Define a reusable function to transform features consistently
# We apply the identical math transformation to BOTH train and test sets to avoid Data Leakage.
def add_interaction_features(df):
    # Copy the dataframe to avoid modifications to original reference
    df_copy = df.copy()
    
    # Feature 1: Cost-per-ticket ratio
    # If support tickets are 0, division returns infinity. We add +1 to the denominator to smooth the boundary.
    df_copy["charge_per_ticket"] = df_copy["monthly_charges"] / (df_copy["support_tickets"] + 1)
    
    # Feature 2: Tenure-to-Age Ratio 
    # Measures what fraction of a customer's life has been spent with this service.
    df_copy["lifecycle_ratio"] = df_copy["tenure_months"] / df_copy["age"]
    
    return df_copy

# 3. Process data partitions
print("Engineering structural interaction columns...")
X_train_engineered = add_interaction_features(X_train)
X_test_engineered = add_interaction_features(X_test)

# 4. Overwrite existing split files with the updated enriched features
X_train_engineered.to_csv(train_path, index=False)
X_test_engineered.to_csv(test_path, index=False)

print("Feature engineering complete! Enriched datasets saved successfully.")
print(f"New feature matrix columns list: {list(X_train_engineered.columns)}")
print("\nSample engineered records view:")
print(X_train_engineered[["monthly_charges", "support_tickets", "charge_per_ticket", "lifecycle_ratio"]].head(2))