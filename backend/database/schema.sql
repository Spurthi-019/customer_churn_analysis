-- 1. Drop the table if it already exists to guarantee clean environment re-runs
DROP TABLE IF EXISTS customers;

-- 2. Create the core structural customers table
CREATE TABLE customers (
    customer_id VARCHAR(50) PRIMARY KEY,
    age INT NOT NULL,
    tenure_months INT NOT NULL,
    contract_type VARCHAR(50) NOT NULL,
    monthly_charges NUMERIC(10, 2) NOT NULL,
    total_charges NUMERIC(10, 2) NOT NULL,
    support_tickets INT DEFAULT 0 NOT NULL,
    churn INT NOT NULL
);

-- 3. Build a performance B-Tree Index on the churn column
-- Since the business frontend dashboard will constantly filter for high-risk churned users (churn = 1),
-- this index speeds up database query scanning times exponentially.
CREATE INDEX idx_customers_churn ON customers(churn);