import pytest
import pandas as pd
import numpy as np
from ml_pipeline.engineer_features import add_interaction_features

print("\nExecuting Test Suite Configuration...")

# 1. Test Case 1: Validate that Laplace smoothing prevents division-by-zero crashes
def test_laplace_smoothing_division_by_zero():
    # Setup: Create a mock frame where a customer has exactly 0 support tickets
    mock_data = pd.DataFrame({
        "age": [30],
        "tenure_months": [12],
        "monthly_charges": [100.0],
        "support_tickets": [0] # This would cause an ordinary division crash
    })
    
    # Run the feature engineering logic
    processed_df = add_interaction_features(mock_data)
    
    # Assert: Verify the column exists and equals exactly 100.0 (100.0 / (0 + 1))
    assert "charge_per_ticket" in processed_df.columns
    assert processed_df["charge_per_ticket"].iloc[0] == 100.0
    # Ensure no infinite or missing values were injected
    assert not np.isinf(processed_df["charge_per_ticket"].iloc[0])

# 2. Test Case 2: Validate that all required engineered features are produced
def test_feature_columns_generation():
    mock_data = pd.DataFrame({
        "age": [40],
        "tenure_months": [20],
        "monthly_charges": [50.0],
        "support_tickets": [4]
    })
    
    processed_df = add_interaction_features(mock_data)
    
    # Assert: Ensure both of our custom interaction tracking columns are present
    assert "charge_per_ticket" in processed_df.columns
    assert "lifecycle_ratio" in processed_df.columns
    
    # Assert: Validate mathematical accuracy for lifecycle ratio (20 months / 40 years old = 0.5)
    assert processed_df["lifecycle_ratio"].iloc[0] == 0.5