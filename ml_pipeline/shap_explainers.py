import os
import joblib
import pandas as pd
import shap

print("==================================================")
print("        INITIALIZING SHAP EXPLAINER ENGINE        ")
print("==================================================\n")

# 1. Load the testing data features to use as evaluation references
X_test = pd.read_csv(os.path.join("data", "X_test.csv"))

# 2. Load the production champion model
model_path = os.path.join("models", "production_model.pkl")
model = joblib.load(model_path)

# 3. Handle model types dynamically to ensure game-theory compatibility
# LogisticRegression outputs raw log-odds by default, which matches SHAP's linear explainer perfectly
if model.__class__.__name__ == "LogisticRegression":
    print("Building SHAP Linear Explainer for Logistic Regression...")
    explainer = shap.LinearExplainer(model, X_test)
    shap_values = explainer(X_test)
else:
    print("Building SHAP Tree Explainer for Ensemble Model...")
    explainer = shap.TreeExplainer(model)
    # Extract the SHAP values corresponding specifically to the Churn (1) outcome
    shap_values = explainer(X_test)
    if isinstance(shap_values, list):
        shap_values = shap_values[1]

print("SHAP values calculated successfully across test matrix.")

# 4. Extract and print personalized explanations for an individual high-risk customer
# Let's inspect Customer Index 0 as our operational example
customer_idx = 0
customer_features = X_test.iloc[customer_idx]

print(f"\n--- LOCALIZED SHAP PROFILE FOR CUSTOMER AT INDEX [{customer_idx}] ---")
print("Feature Values:")
for col in X_test.columns:
    print(f"  {col:<25} = {customer_features[col]:.2f}")

# Extract the individual force contributions for this specific row
# For SHAP objects, if it's an Explanation instance, we fetch its values array
if hasattr(shap_values, "values"):
    individual_shap = shap_values.values[customer_idx]
    base_value = shap_values.base_values[customer_idx] if hasattr(shap_values.base_values, "__len__") else shap_values.base_values
else:
    individual_shap = shap_values[customer_idx]
    base_value = explainer.expected_value

print(f"\nBaseline Model Value (Expected Average): {base_value:.4f}")
print("\nIndividual Feature Attributions (SHAP values):")
print(f"{'Feature Name':<25} | {'SHAP Impact Score':<18} | Direction Influence")
print("-" * 65)

for i, col in enumerate(X_test.columns):
    impact = individual_shap[i] if not hasattr(individual_shap, "values") else individual_shap.values[i]
    direction = "PUSHES TOWARD CHURN (❌ Risk Factor)" if impact > 0 else "PULLS TOWARD RETENTION (✅ Safe Factor)"
    print(f"{col:<25} | {impact:<18.4f} | {direction}")

print("\n==================================================")
print("        SHAP LOCAL INTERPRETABILITY COMPLETE      ")
print("==================================================")