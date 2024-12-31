import joblib
import pandas as pd

# Load the saved model, scaler, and model columns
model = joblib.load('irrigation_logistic_model.joblib')
scaler = joblib.load('scaler.pkl')
model_columns = joblib.load('model_columns_irrigation.pkl')

# Prepare new input data
new_data = pd.DataFrame([{
    'CropType': 'coffee',
    'CropDays': 7,
    'SoilMoisture': 653,
    'temperature': 20,
    'Humidity': 54
}])

# One-hot encode 'CropType'
new_data_encoded = pd.get_dummies(new_data, columns=['CropType'])

# Align new data with model columns
for col in model_columns:
    if col not in new_data_encoded.columns:
        new_data_encoded[col] = 0  # Add missing columns with value 0

new_data_encoded = new_data_encoded[model_columns]  # Ensure column order matches

# Scale the input data
new_data_scaled = scaler.transform(new_data_encoded)

# Make prediction
prediction = model.predict(new_data_scaled)
print(f"Predicted irrigation requirement: {'Yes' if prediction[0] == 1 else 'No'}")
