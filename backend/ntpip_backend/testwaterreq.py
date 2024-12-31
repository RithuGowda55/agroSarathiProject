import joblib
import pandas as pd

# Load the saved model and column names
model = joblib.load('water_requirement_linear_model.joblib')
model_columns = joblib.load('model_columns_water.pkl')  # Load saved columns from training

# Example new input data
new_data = pd.DataFrame([{
    'CROP TYPE': 'groundnut',
    'SOIL TYPE': 'humid',
    'REGION': 'desert',
    'TEMPERATURE': 25,
    'WEATHER CONDITION': 'rainy'
}])

# One-hot encode the categorical features in the new data
new_data_encoded = pd.get_dummies(new_data, columns=['CROP TYPE', 'SOIL TYPE', 'REGION', 'WEATHER CONDITION'])

# Ensure the new data has the same columns as the training data
# Add missing columns
for col in model_columns:
    if col not in new_data_encoded.columns:
        new_data_encoded[col] = 0  # Add missing columns with default value 0

# Drop extra columns not in training data
new_data_encoded = new_data_encoded[model_columns]

# Reorder columns to match the model's training format
new_data_encoded = new_data_encoded[model_columns]

# Make a prediction
predicted_water_requirement = model.predict(new_data_encoded)
print(f"Predicted Water Requirement: {predicted_water_requirement[0]}")
