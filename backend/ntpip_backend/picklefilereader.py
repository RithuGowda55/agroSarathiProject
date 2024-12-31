import joblib

# Load the pickle file (model)
model = joblib.load('water_requirement_model.pkl')  # Replace with your pickle file path

# Display the model
print(model)

# If the model has attributes like feature names or coefficients, print them
if hasattr(model, 'feature_names_in_'):
    print("Feature names in the model:", model.feature_names_in_)

# If it's a model that has coefficients (like Logistic Regression), you can print those too
if hasattr(model, 'coef_'):
    print("Model coefficients:", model.coef_)

# If it's a RandomForest or similar model, you can check feature importances
if hasattr(model, 'feature_importances_'):
    print("Feature importances:", model.feature_importances_)
