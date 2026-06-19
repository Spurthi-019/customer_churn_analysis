# AI-Powered Customer Intelligence & Churn Prediction System

## System Specifications
- **Backend Framework:** FastAPI (Python 3.10+)
- **Frontend Framework:** React.js (Vite, Tailwind CSS)
- **Database:** PostgreSQL
- **Machine Learning Stack:** Scikit-Learn, Pandas, NumPy, SHAP

## Data Flow Pipeline
1. **Ingestion:** Historical customer data is cleaned and stored in PostgreSQL.
2. **Training:** Python scripts pull data, train Random Forest/Gradient Boosting models, and export serialized model files (`.pkl`).
3. **Inference:** FastAPI loads the trained model. When the frontend requests a customer's profile, the backend calculates the real-time churn probability and generates SHAP explanations.
4. **Action:** The dashboard displays the risk metrics along with explicit retention strategies.