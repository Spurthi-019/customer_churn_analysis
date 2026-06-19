import os
import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

print("==================================================")
print("         INITIALIZING MODEL EVALUATION            ")
print("==================================================\n")

# 1. Load the engineered testing dataset
X_test = pd.read_csv(os.path.join("data", "X_test.csv"))
y_test = pd.read_csv(os.path.join("data", "y_test.csv")).values.ravel()

# 2. List our saved models to evaluate
model_names = ["logistic_regression", "random_forest", "gradient_boosting"]

# 3. Outer evaluation loop
for name in model_names:
    model_path = os.path.join("models", f"{name}.pkl")
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file missing at {model_path}. Run train_models.py first.")
    
    # Load the serialized model back into memory
    model = joblib.load(model_path)
    
    # Generate hard class predictions (0 or 1)
    predictions = model.predict(X_test)
    
    # Generate continuous risk probabilities for the positive class (churn = 1)
    probabilities = model.predict_proba(X_test)[:, 1]
    
    # 4. Compute industry-standard evaluation metrics
    acc = accuracy_score(y_test, predictions)
    prec = precision_score(y_test, predictions)
    rec = recall_score(y_test, predictions)
    f1 = f1_score(y_test, predictions)
    roc_auc = roc_auc_score(y_test, probabilities)
    
    # Print metrics beautifully to console
    print(f"--- Performance Metrics: {name.upper()} ---")
    print(f"Accuracy  : {acc:.4f}")
    print(f"Precision : {prec:.4f}")
    print(f"Recall    : {rec:.4f}")
    print(f"F1-Score  : {f1:.4f}")
    print(f"ROC AUC   : {roc_auc:.4f}\n")

print("==================================================")
print("          MODEL EVALUATION CYCLE COMPLETE         ")
print("==================================================")