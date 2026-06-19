import os
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# 1. Initialize FastAPI Application
app = FastAPI(
    title="Enterprise Customer Churn Prediction Engine",
    description="Production-grade API for predicting real-time customer churn risk and generating prescriptive retention strategies.",
    version="1.0.0"
)

# 2. Securely load our promoted Production Model binary into server memory at startup
MODEL_PATH = os.path.join("models", "production_model.pkl")
if not os.path.exists(MODEL_PATH):
    raise RuntimeError(f"Critical Error: Production model binary not found at {MODEL_PATH}. Run training pipeline first.")

production_model = joblib.load(MODEL_PATH)
print(f"🚀 Production model [{production_model.__class__.__name__}] successfully loaded into server RAM!")

# 3. Define the structural Pydantic Input Schema matching incoming client application JSON payloads
class CustomerDataInput(BaseModel):
    age: int
    tenure_months: int
    contract_type: str  # Expected: "Month-to-month", "One year", or "Two year"
    monthly_charges: float
    total_charges: float
    support_tickets: int

# 4. Root Health-Check Endpoint
@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "engine": "FastAPI Server",
        "message": "Customer Churn Prediction API Gateway is fully operational."
    }

# 5. Live Predictive Inference Endpoint
@app.post("/api/v1/predict")
def predict_churn(input_data: CustomerDataInput):
    try:
        # Step A: Convert incoming Pydantic validation object to a standard Python dictionary
        raw_payload = input_data.model_dump()
        
        # Step B: Perform One-Hot Encoding to match the model's exact dimensional structure
        # Initialize binary bits for categorical properties manually to eliminate pandas overhead
        contract_one_year = 1 if raw_payload["contract_type"] == "One year" else 0
        contract_two_year = 1 if raw_payload["contract_type"] == "Two year" else 0
        
        # Step C: Implement stateless, row-level Feature Engineering interaction rules (including Laplace Smoothing)
        charge_per_ticket = raw_payload["monthly_charges"] / (raw_payload["support_tickets"] + 1)
        lifecycle_ratio = raw_payload["tenure_months"] / raw_payload["age"]
        
        # Step D: Construct a structural Pandas DataFrame matching the exact vector shape the model learned on
        feature_matrix = pd.DataFrame([{
            "age": raw_payload["age"],
            "tenure_months": raw_payload["tenure_months"],
            "monthly_charges": raw_payload["monthly_charges"],
            "total_charges": raw_payload["total_charges"],
            "support_tickets": raw_payload["support_tickets"],
            "contract_type_One year": contract_one_year,
            "contract_type_Two year": contract_two_year,
            "charge_per_ticket": charge_per_ticket,
            "lifecycle_ratio": lifecycle_ratio
        }])
        
        # Step E: Execute model prediction probabilities
        # We slice the positive index [1] to grab the percentage chance of churn occurring
        churn_prob = float(production_model.predict_proba(feature_matrix)[0][1])
        churn_decision = 1 if churn_prob >= 0.50 else 0
        
        # Step F: Prescriptive Analytics layer matching corporate action playbooks dynamically
        if churn_prob < 0.40:
            strategy = "No Action Required"
            details = "Customer metrics indicate healthy account stability."
        elif raw_payload["support_tickets"] >= 3:
            strategy = "Technical Concierge Assignment"
            details = f"Immediately escalate to a Tier-3 engineer. User has filed {raw_payload['support_tickets']} technical complaints."
        elif contract_one_year == 0 and contract_two_year == 0:
            strategy = "Long-term Contract Incentive Offer"
            details = "Proactively extend a 15% monthly billing discount locked into a structural 12-month contract commitment."
        else:
            strategy = "Plan Downgrade / Optimization Review"
            details = f"Trigger Account Executive outreach to transition user from ${raw_payload['monthly_charges']:.2f}/mo to a cost-optimized tier."

        # Step G: Return the complete structured response back to the client application
        return {
            "customer_analytics": {
                "churn_probability": round(churn_prob * 100, 2), # Convert fraction cleanly to percentage
                "risk_status": "HIGH RISK" if churn_decision == 1 else "LOW RISK",
            },
            "prescriptive_action": {
                "recommended_strategy": strategy,
                "execution_details": details
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference Pipeline Failure: {str(e)}")