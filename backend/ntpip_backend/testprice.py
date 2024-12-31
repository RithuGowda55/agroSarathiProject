import joblib
import pandas as pd

# Load the saved model, scaler, and column names
model = joblib.load('price_predicted.pkl')
scaler = joblib.load('scaler_price.pkl')
model_columns = joblib.load('price_model_columns.pkl')  # Load the saved column names

# Prepare new input data (make sure it's encoded and scaled in the same way)
new_data = pd.DataFrame([{
    'State': 'Karnataka', 
    'District': 'Mysore', 
    'Market': 'Nanjangud', 
    'Commodity': 'Ragi', 
    'Variety': 'Red',
    'Grade': 'FAQ'
}])

# One-hot encode categorical columns
new_data_encoded = pd.get_dummies(new_data)

# Add missing columns with 0 and drop extra columns
missing_cols = [col for col in model_columns if col not in new_data_encoded.columns]
missing_data = pd.DataFrame(0, index=new_data_encoded.index, columns=missing_cols)
new_data_encoded = pd.concat([new_data_encoded, missing_data], axis=1)


# Drop any extra columns not in model_columns
new_data_encoded = new_data_encoded[model_columns]

# Scale the input data using the saved scaler
new_data_scaled = scaler.transform(new_data_encoded)

# Make prediction
prediction = model.predict(new_data_scaled)
print(f"Predicted price requirement: {prediction[0]}")
