import os
import joblib
import pandas as pd
from sklearn.metrics import f1_score, roc_auc_score

print("==================================================")
print("       AUTOMATED MODEL COMPARISON & SELECTION      ")
print("==================================================\n")

# 1. Load the testing data arrays
X_test = pd.read_csv(os.path.join("data", "X_test.csv"))
y_test = pd.read_csv(os.path.join("data", "y_test.csv")).values.ravel()

# Define the models we want to evaluate
model_names = ["logistic_regression", "random_forest", "gradient_boosting"]

best_score = -1.0
best_model_name = None
best_model_object = None

# 2. Programmatically evaluate and track performance
for name in model_names:
    model_path = os.path.join("models", f"{name}.pkl")
    model = joblib.load(model_path)
    
    # Calculate key validation metrics
    predictions = model.predict(X_test)
    probabilities = model.predict_proba(X_test)[:, 1]
    
    f1 = f1_score(y_test, predictions)
    roc_auc = roc_auc_score(y_test, probabilities)
    
    # Balance both metrics by taking their average to choose our production champion
    champion_metric = (f1 + roc_auc) / 2
    print(f"Model: {name:<20} | Balanced Score: {champion_metric:.4f}")
    
    # Conditional tracking to store the absolute highest performer
    if champion_metric > best_score:
        best_score = champion_metric
        best_model_name = name
        best_model_object = model

print(f"\n🏆 CHAMPION MODEL SELECTION: {best_model_name.upper()} (Score: {best_score:.4f})")

# 3. Serialize and promote the champion model to production-ready standing
production_model_path = os.path.join("models", "production_model.pkl")
joblib.dump(best_model_object, production_model_path)

print(f"Successfully promoted and saved -> {production_model_path}")
print("==================================================")