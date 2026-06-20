import psycopg2
import random

# Database Connection Configuration
DB_CONFIG = {
    "dbname": "postgres",
    "user": "postgres",
    "password": "Spurthi@123",  # 🔑 Replace with your actual password
    "host": "127.0.0.1",
    "port": "5432"
}

def rebuild_and_seed_perfect_mix():
    try:
       # ❌ OLD CRASHING CODE:
# conn = psycopg2.connect(postgresql://neondb_owner:npg_Sn3ZcI8APeJj@ep-falling-band-aovfp5yl.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require)

# ✅ FIXED PRODUCTION CODE:
        conn = psycopg2.connect("postgresql://neondb_owner:npg_Sn3ZcI8APeJj@ep-falling-band-aovfp5yl.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require") 
        cursor = conn.cursor()

        # 🏗️ SCHEMA BLUEPRINT SYNCHRONIZATION BLOCK
        # Automatically instantiate the table structure if it's missing on Neon
        print("🏗️ Verifying relational schema table structures...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS customers (
                customer_id VARCHAR(50) PRIMARY KEY,
                gender VARCHAR(20),
                senior_citizen VARCHAR(5),
                partner VARCHAR(5),
                dependents VARCHAR(5),
                tenure_months INT,
                internet_service VARCHAR(50),
                payment_method VARCHAR(100),
                paperless_billing VARCHAR(5),
                monthly_charges NUMERIC(10, 2),
                total_charges NUMERIC(10, 2),
                support_tickets INT
            );
        """)
        conn.commit()

        # 🧹 Flushing table to ensure clean sequential generation...
        print("🧹 Flushing table to ensure clean sequential generation...")
        cursor.execute("TRUNCATE TABLE customers RESTART IDENTITY CASCADE;")
        conn.commit()

        # 2. Add the original 3 foundation records back into the batch pool
        base_customers = ['1087', '2441', '9932']
        
        # 3. Create the massive range pool from 1000 to 1050
        extended_range = [str(i) for i in range(1000, 1080)]
        
        # Combine them into a single target list of 54 total accounts
        all_target_ids = list(set(base_customers + extended_range))
        
        genders = ['Male', 'Female']
        new_rows = []
        high_count = 0
        low_count = 0

        # 4. Loop through every single ID and build balanced features from scratch
        for idx, cid in enumerate(all_target_ids):
            gender = random.choice(genders)
            partner = random.choice(['Yes', 'No'])
            dependents = random.choice(['Yes', 'No'])
            paperless = random.choice(['Yes', 'No'])
            
            if idx % 2 == 0:
                # 🔴 FORCE HIGH RISK TELEMETRY (Low tenure, high tickets)
                tenure = 1
                monthly_charges = 115.50
                total_charges = 115.50
                support_tickets = 6
                internet_service = 'Fiber Optic'
                payment_method = 'Electronic check'
                high_count += 1
            else:
                # 🟢 FORCE LOW RISK TELEMETRY (High tenure, zero complaints)
                tenure = 65
                monthly_charges = 25.00
                total_charges = 1625.00
                support_tickets = 0
                internet_service = 'No'
                payment_method = 'Credit card'
                low_count += 1

            new_rows.append((
                cid, gender, 'No', partner, dependents, 
                tenure, internet_service, payment_method, paperless, 
                monthly_charges, total_charges, support_tickets
            ))

        # 5. Bulk insert everything into the database rows
        query = """
            INSERT INTO customers (
                customer_id, gender, senior_citizen, partner, dependents, 
                tenure_months, internet_service, payment_method, paperless_billing, 
                monthly_charges, total_charges, support_tickets
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """
        
        cursor.executemany(query, new_rows)
        conn.commit()
        
        print(f"📦 Successfully inserted {len(new_rows)} rows into PostgreSQL.")
        print(f"✅ Balanced Mix: {high_count} High-Risk profiles & {low_count} Low-Risk profiles are now live!")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"⚠️ Script failure: {str(e)}")

if __name__ == "__main__":
    rebuild_and_seed_perfect_mix()