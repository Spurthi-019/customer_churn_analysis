import os
import joblib
import pandas as pd
import numpy as np

print("==================================================")
print("        EXTRACTING GLOBAL FEATURE IMPORTANCE      ")
print("==================================================\n")

# 1. Load the columns structure from our training set
X_train_path = os.path.join("data", "X_train.csv")
if not os.path.exists(X_train_path):
    raise FileNotFoundError("Training data features are missing. Run preprocess_data.py first.")

feature_names = pd.read_csv(X_train_path).columns

# 2. Load the production champion model
model_path = os.path.join("models", "production_model.pkl")
if not os.path.exists(model_path):
    raise FileNotFoundError("Production model is missing. Run compare_models.py first.")

model = joblib.load(model_path)

# 3. Dynamically extract weights based on the model type
model_classname = model.__class__.__name__
print(f"Detected Production Model Type: {model_classname}\n")

if hasattr(model, "feature_importances_"):
    # If it's Gradient Boosting or Random Forest, use tree impurity weights
    importances = model.feature_importances_
else:
    # If it's Logistic Regression, use the absolute values of the coefficients
    # We take the absolute value because a large negative weight is just as powerful as a positive one!
    importances = np.abs(model.coef_[0])
    # Normalize the coefficients so they sum up to 1.0, matching tree scales
    importances = importances / np.sum(importances)

# 4. Map importances into a clean pandas DataFrame for sorting
importance_df = pd.DataFrame({
    "Feature": feature_names,
    "Importance_Score": importances
}).sort_values(by="Importance_Score", ascending=False)

# 5. Print out the ranked business intelligence scoreboard
print("--- RANKED FACTOR SCOREBOARD ---")
for index, row in importance_df.iterrows():
    print(f"Rank: {row['Feature']:<25} | Score: {row['Importance_Score']:.4f}")

print("\n==================================================")
print("     FEATURE IMPORTANCE EXTRACTION COMPLETE       ")
print("==================================================")