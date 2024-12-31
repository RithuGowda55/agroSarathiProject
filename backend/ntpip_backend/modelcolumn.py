import joblib

# Load the saved model
water_model = joblib.load('irrigation_model.pkl')

# Check if the model has the feature names attribute (scikit-learn 0.24+)
if hasattr(water_model, 'feature_names_in_'):
    # Display the feature names used during training
    print("Model columns (features) used for training:")
    print(water_model.feature_names_in_)
else:
    print("The model doesn't store the feature names directly.")
