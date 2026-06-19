import os
import numpy as np
import pandas as pd

# 1. Set a random seed for reproducible results across all environments
np.random.seed(42)

# 2. Configure sample space constraints
num_customers = 10000

print(f"Generating synthetic dataset containing {num_customers} customer profiles...")

# 3. Generate independent base features using numpy distributions
customer_ids = [f"CUST-{i:05d}" for i in range(1, num_customers + 1)]
age = np.random.randint(18, 70, size=num_customers)
tenure_months = np.random.randint(1, 72, size=num_customers)
monthly_charges = np.round(np.random.uniform(20.0, 180.0, size=num_customers), 2)

# Total charges calculated mathematically with slight random variance added
total_charges = np.round(tenure_months * monthly_charges * np.random.uniform(0.95, 1.05, size=num_customers), 2)
contract_type = np.random.choice(["Month-to-month", "One year", "Two year"], size=num_customers, p=[0.5, 0.25, 0.25])
support_tickets = np.random.poisson(lam=1.5, size=num_customers)

# 4. Inject structural ground-truth logic linking behavioral features directly to churn risk
# Churn risk increases significantly if the customer has high charges, high support tickets, and short contract terms
churn_log_odds = (
    -2.0 
    + (support_tickets * 0.6) 
    + (monthly_charges * 0.015) 
    - (tenure_months * 0.04) 
    + (np.where(contract_type == "Month-to-month", 1.5, -1.0))
)

# Convert mathematical log-odds scores smoothly into probabilities using a sigmoid function
churn_probability = 1 / (1 + np.exp(-churn_log_odds))

# Randomly sample binary output states (0=Stay, 1=Churn) based on calculated probabilities
churn_labels = np.random.binomial(n=1, p=churn_probability)

# 5. Compile arrays into a structural pandas DataFrame object
df = pd.DataFrame({
    "customer_id": customer_ids,
    "age": age,
    "tenure_months": tenure_months,
    "contract_type": contract_type,
    "monthly_charges": monthly_charges,
    "total_charges": total_charges,
    "support_tickets": support_tickets,
    "churn": churn_labels
})

# 6. Securely export data to disk format inside the data/ folder
output_path = os.path.join("data", "customer_churn.csv")
df.to_csv(output_path, index=False)

print(f"Dataset completely generated and saved to {output_path} successfully!")
print(df.head())