import os
import pandas as pd
import joblib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Any, Dict
import uvicorn
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

# Define the absolute path to the model and encoders
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'xgboost_model.pkl')
TITLE_ENCODER_PATH = os.path.join(BASE_DIR, 'title_label_encoder.pkl')
PRIORITY_ENCODER_PATH = os.path.join(BASE_DIR, 'priority_label_encoder.pkl')
LABEL_ENCODER_PATH = os.path.join(BASE_DIR, 'label_label_encoder.pkl')
REMINDER_ENCODER_PATH = os.path.join(BASE_DIR, 'reminder_label_encoder.pkl')

# Load the model and label encoders
try:
    model = joblib.load(MODEL_PATH)
    label_encoders = {
        'title': joblib.load(TITLE_ENCODER_PATH),
        'priority': joblib.load(PRIORITY_ENCODER_PATH),
        'label': joblib.load(LABEL_ENCODER_PATH),
        'reminder': joblib.load(REMINDER_ENCODER_PATH)
    }
    logger.info("Model and encoders loaded successfully.")
except FileNotFoundError as e:
    logger.error(f"Model or encoders not found: {e}")
    raise RuntimeError(f"Model or encoders not found: {e}")

# Define the feature columns used in the model
FEATURE_COLUMNS = ['endTime', 'label', 'priority', 'reminder', 'startTime', 'title', 'dueDate_day', 'dueDate_month', 'dueDate_year']

class UserInput(BaseModel):
    description: str
    dueDate: str
    endTime: str
    label: str
    priority: str
    reminder: str
    startTime: str
    title: str

# Function to estimate task time based on user input
def estimate_task_time(user_input: Dict[str, Any]) -> float:
    logger.debug(f"Received user input for estimation: {user_input}")

    # Handle unseen labels gracefully
    for column in ['title', 'priority', 'label', 'reminder']:
        encoder = label_encoders[column]
        try:
            user_input[column] = encoder.transform([user_input[column]])[0]
        except ValueError:
            logger.warning(f"Unseen label for column {column}: {user_input[column]}")
            # Use the default value (e.g., 0) for unseen labels
            user_input[column] = 0

    # Convert user input to DataFrame
    user_input_df = pd.DataFrame([user_input])

    # Convert 'dueDate' to datetime and extract features
    if 'dueDate' in user_input_df:
        due_date = pd.to_datetime(user_input_df['dueDate'][0])
        user_input_df['dueDate_day'] = due_date.day
        user_input_df['dueDate_month'] = due_date.month
        user_input_df['dueDate_year'] = due_date.year
        user_input_df = user_input_df.drop(columns=['dueDate', 'description'])
    
    # Convert time columns to numeric (total minutes from midnight)
    user_input_df['startTime'] = pd.to_datetime(user_input_df['startTime'], format='%H:%M').dt.hour * 60 + pd.to_datetime(user_input_df['startTime'], format='%H:%M').dt.minute
    user_input_df['endTime'] = pd.to_datetime(user_input_df['endTime'], format='%H:%M').dt.hour * 60 + pd.to_datetime(user_input_df['endTime'], format='%H:%M').dt.minute

    # Ensure all required columns are present
    for col in FEATURE_COLUMNS:
        if col not in user_input_df.columns:
            user_input_df[col] = 0
    
    # Ensure correct order of columns
    user_input_df = user_input_df[FEATURE_COLUMNS]

    logger.debug(f"DataFrame for prediction: {user_input_df}")

    # Predict the task time using the trained model
    try:
        estimated_time = model.predict(user_input_df)
        logger.debug(f"Estimated time: {estimated_time[0]}")
        return float(estimated_time[0])
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise

@app.post('/predict')
def predict(user_input: UserInput):
    logger.debug("Predict endpoint called.")
    try:
        estimated_time = estimate_task_time(user_input.dict())
        return {'estimated_time': estimated_time}
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8081)
