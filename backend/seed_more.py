import psycopg2
import random

# Database Connection Configuration 
DB_CONFIG = {
    "dbname": "postgres",
    "user": "postgres",
    "password": "Spurthi@123",  # 🔑 Replace with your actual password
    "host": "localhost",
    "port": "5432"
}

def seed_balanced_mix():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("🔌 Connecting to PostgreSQL Cluster...")
        
        # Wipe out the old un-balanced rows from 1011 to 1050 so we can replace them cleanly
        print("🧹 Clearing out old test range profiles (1011-1050)...")
        cursor.execute("DELETE FROM customers WHERE CAST(customer_id AS INT) BETWEEN 1011 AND 1050;")

        genders = ['Male', 'Female']
        payment_methods = ['Electronic check', 'Mailed check', 'Bank transfer', 'Credit card']
        new_customers = []

        # Generate customer profiles loops dynamically from ID 1011 to 1050
        for cid in range(1000, 1051):
            gender = random.choice(genders)
            partner = random.choice(['Yes', 'No'])
            dependents = random.choice(['Yes', 'No'])
            paperless = random.choice(['Yes', 'No'])
            
            # ALTERNATE SECURELY BETWEEN HIGH RISK AND LOW RISK PATTERNS
            if cid % 2 == 0:
                # 🔴 FORCE HIGH CHURN RISK BIAS VECTOR
                senior_citizen = random.choices(['Yes', 'No'], weights=[40, 60])[0]
                tenure = random.randint(1, 9)               # Brand new unstable accounts
                internet_service = 'Fiber Optic'            # High-priced infrastructure
                payment_method = 'Electronic check'         # High churn correlation payment method
                monthly_charges = round(random.uniform(95.00, 120.00), 2)
                support_tickets = random.randint(3, 6)      # ⚠️ Critical factor: Heavy complaint backlog
                
            else:
                # 🟢 FORCE LOW CHURN RISK BIAS VECTOR
                senior_citizen = 'No'
                tenure = random.randint(45, 72)             # Highly loyal, long-standing contracts
                internet_service = random.choice(['DSL', 'No'])
                payment_method = random.choice(['Bank transfer', 'Credit card'])
                monthly_charges = round(random.uniform(20.00, 55.00), 2)
                support_tickets = random.randint(0, 1)      # Zero to minimal platform friction
                
            total_charges = round(monthly_charges * tenure, 2)

            new_customers.append((
                str(cid), gender, senior_citizen, partner, dependents, 
                tenure, internet_service, payment_method, paperless, 
                monthly_charges, total_charges, support_tickets
            ))

        query = """
            INSERT INTO customers (
                customer_id, gender, senior_citizen, partner, dependents, 
                tenure_months, internet_service, payment_method, paperless_billing, 
                monthly_charges, total_charges, support_tickets
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """
        
        cursor.executemany(query, new_customers)
        conn.commit()
        
        print(f"🚀 Success! Overwrote target boundaries with {len(new_customers)} perfectly balanced behavioral accounts.")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"⚠️ Insertion pipeline failed: {str(e)}")

if __name__ == "__main__":
    seed_balanced_mix()