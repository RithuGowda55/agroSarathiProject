from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import joblib
import pandas as pd

# Load dataset
df2 = pd.read_csv('../data/irrigationdata.csv')

# Define all possible categories for 'CropType'
all_crop_types = ['coffee', 'garden flowers', 'maize', 'groundnuts', 'paddy', 'potato','pulse','sugarcane','wheat']  # Add all possible CropType categories

# Prepare inputs
X = df2[['CropType', 'CropDays', 'SoilMoisture', 'temperature', 'Humidity']]
y = df2['Irrigation']  # Target: 0 or 1 (binary)

# Perform one-hot encoding for 'CropType' with predefined categories
X_encoded = pd.get_dummies(X, columns=['CropType'])
for crop in all_crop_types:
    if f'CropType_{crop}' not in X_encoded.columns:
        X_encoded[f'CropType_{crop}'] = 0  # Add missing categories as columns with value 0

# Scale the data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_encoded)

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Train the LogisticRegression model
model = LogisticRegression(max_iter=500, random_state=42)
model.fit(X_train, y_train)

# Evaluate model
accuracy = model.score(X_test, y_test)
print(f"Logistic Regression model accuracy: {accuracy:.2f}")

# Save the trained model, scaler, and column names
joblib.dump(model, 'irrigation_logistic_model.joblib')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(X_encoded.columns.tolist(), 'model_columns_irrigation.pkl')  # Save column names as list

print("Logistic regression model, scaler, and columns saved successfully.")
