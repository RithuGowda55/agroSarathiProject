import pandas as pd
import joblib

# Load the trained model
model = joblib.load('fertilizer_model.pkl')

def predict_fertilizer(data):
    # Convert the input data into a DataFrame (this will typically come from user input or an API request)
    df = pd.DataFrame([data])
    print(df)
    
    # Perform one-hot encoding for 'Soil Type' and 'Crop Type' (same as done during training)
    df = pd.get_dummies(df, columns=['Soil Type', 'Crop Type'], drop_first=True)
    
    # Ensure the DataFrame has the same columns as the training set
    model_columns = ['Temparature', 'Moisture', 'Nitrogen', 'Potassium', 'Phosphorous',
                     'Soil Type_Clayey', 'Soil Type_Loamy', 'Soil Type_Red', 'Soil Type_Sandy',
                     'Crop Type_Cotton', 'Crop Type_Ground Nuts', 'Crop Type_Maize', 'Crop Type_Millets',
                     'Crop Type_Oil seeds', 'Crop Type_Paddy', 'Crop Type_Pulses', 'Crop Type_Sugarcane',
                     'Crop Type_Tobacco', 'Crop Type_Wheat']
    
    # Add missing columns and set them to 0 (for cases where some one-hot encoded features may be missing in new data)
    for col in model_columns:
        if col not in df.columns:
            df[col] = 0
    
    # Ensure the columns are in the same order as the training set
    df = df[model_columns]
    print(df)
    
    # Make the prediction
    prediction = model.predict(df)
    print(prediction)
    
    # Return the predicted fertilizer
    return prediction[0]

# Example input data (this would come from user input or a form submission)
input_data = {
    'Temparature': 18,
    'Moisture': 32,
    'Nitrogen': 21,
    'Potassium': 8,
    'Phosphorous': 16,
    'Soil Type': 'red',
    'Crop Type': 'tobacco'
}

# Predict fertilizer
fertilizer_prediction = predict_fertilizer(input_data)
print(f"Predicted fertilizer: {fertilizer_prediction}")
