import os
import joblib
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier

print("==================================================")
print("          INITIALIZING MODEL TRAINING             ")
print("==================================================")

# 1. Load the preprocessed and engineered training data
X_train = pd.read_csv(os.path.join("data", "X_train.csv"))
y_train = pd.read_csv(os.path.join("data", "y_train.csv")).values.ravel() 
# .values.ravel() flattens the column dataframe into a 1D array required by scikit-learn

# 2. Instantiate the three Machine Learning Algorithms
# We set random_state=42 across models to lock consistency across training runs
models = {
    "logistic_regression": LogisticRegression(max_iter=1000, random_state=42),
    "random_forest": RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1),
    "gradient_boosting": GradientBoostingClassifier(n_estimators=100, random_state=42)
}

# 3. Procedural Training Loop
for model_name, model_object in models.items():
    print(f"Training {model_name}... Please wait.")
    
    # .fit() executes the mathematical optimization algorithms to learn patterns
    model_object.fit(X_train, y_train)
    
    # Define file path and save the model using joblib serialization
    model_output_path = os.path.join("models", f"{model_name}.pkl")
    joblib.dump(model_object, model_output_path)
    
    print(f"Successfully saved {model_name} -> {model_output_path}")

print("\n==================================================")
print("     ALL CANDIDATE MODELS TRAINED SUCCESSFULLY    ")
print("==================================================")