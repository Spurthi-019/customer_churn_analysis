import os
import joblib
import pandas as pd
import numpy as np

print("==================================================")
print("     INITIALIZING RETENTION RECOMMENDATION ENGINE ")
print("==================================================\n")

# 1. Load our testing dataset
X_test = pd.read_csv(os.path.join("data", "X_test.csv"))

# 2. Load the production champion model
model_path = os.path.join("models", "production_model.pkl")
model = joblib.load(model_path)

# 3. Predict actual churn risk probabilities for the test group
probabilities = model.predict_proba(X_test)[:, 1]

# 4. Define our Prescriptive Decision Rules Matrix
def generate_recommendation(row, risk_score):
    # If the customer is safe (risk below 40%), no expensive retention spend is needed
    if risk_score < 0.40:
        return "No Action Required", "Customer behavior indicates high stability."
    
    # Strategy 1: Customer is leaving due to high technical issues
    if row["support_tickets"] >= 3:
        return (
            "Technical Concierge Assignment",
            f"Escalate to tier-3 premium support. Customer has filed {int(row['support_tickets'])} support requests."
        )
    
    # Strategy 2: Customer is on a volatile short-term contract but highly valued
    if row["contract_type_One year"] == 0 and row["contract_type_Two year"] == 0:
        return (
            "Long-term Contract Incentive Offer",
            "Offer a 15% monthly billing discount locked into a 12-month structural commitment."
        )
    
    # Strategy 3: Customer is suffering from financial cost strain
    if row["monthly_charges"] > 120.0:
        return (
            "Plan Downgrade / Optimization Review",
            f"Proactively trigger an account manager review to transition customer from ${row['monthly_charges']:.2f}/mo to a optimized lower tier."
        )
    
    # Default fallback plan for general risk mitigation
    return "Loyalty Check-in Outreach", "Schedule a routine customer success review call."

# 5. Process and evaluate profiles
print("Processing customer cohorts for prescriptive actions...")
recommendations = []
details_log = []

for idx in range(len(X_test)):
    row = X_test.iloc[idx]
    risk = probabilities[idx]
    rec_strategy, rec_details = generate_recommendation(row, risk)
    recommendations.append(rec_strategy)
    details_log.append(rec_details)

# 6. Build a comprehensive analytics DataFrame
summary_df = X_test.copy()
summary_df["churn_probability"] = probabilities
summary_df["recommended_strategy"] = recommendations
summary_df["strategy_details"] = details_log

# 7. Isolate the top high-risk profiles to verify performance
high_risk_customers = summary_df.sort_values(by="churn_probability", ascending=False).head(3)

print("\n--- TOP HIGH-RISK PROACTIVE RECOMMENDATIONS ACTION LOG ---")
for idx, row in high_risk_customers.iterrows():
    print(f"\n[Customer Index: {idx}] | Churn Risk Score: {row['churn_probability']*100:.2f}%")
    print(f"  🎯 Action Strategy : {row['recommended_strategy']}")
    print(f"  📝 Details         : {row['strategy_details']}")

print("\n==================================================")
print("     PRESCRIPTIVE RETENTION EXTRACTION COMPLETE   ")
print("==================================================")