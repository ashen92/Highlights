FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the model files and application code
COPY xgboost_model.pkl .
COPY title_label_encoder.pkl .
COPY priority_label_encoder.pkl .
COPY label_label_encoder.pkl .
COPY reminder_label_encoder.pkl .
COPY predict.py .

EXPOSE 8081

# Command to run the application
CMD ["python", "predict.py"]