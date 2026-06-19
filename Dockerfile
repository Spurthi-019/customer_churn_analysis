# 1. Use an official lightweight Python runtime as a parent base image
FROM python:3.11-slim

# 2. Set structural environment variables inside the container
# Prevents Python from writing pyc files to disc and keeps stdout unbuffered for clean Docker logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3. Set the system working directory inside the virtual container filesystem
WORKDIR /app

# 4. Install native OS system level dependencies required for compiling heavy packages like psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 5. Copy over requirements.txt separate from our code to optimize Docker layer caching
COPY requirements.txt /app/

# 6. Install all locked application python packages inside the container build
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# 7. Copy the remaining source directories into the image assembly space
COPY backend/ /app/backend/
COPY models/ /app/models/
COPY data/ /app/data/

# 8. Expose the standard communication port the API runs on to external network traffic
EXPOSE 8000

# 9. Define the default executable entrypoint command to launch our production Uvicorn runtime
CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8000"]