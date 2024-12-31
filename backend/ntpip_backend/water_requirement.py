import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import joblib

# Load the dataset
df1 = pd.read_csv('../data/waterrequirement.csv')

# Check and convert any range values in numeric columns
def convert_range(value):
    if isinstance(value, str) and '-' in value:
        start, end = value.split('-')
        return (float(start) + float(end)) / 2
    return float(value)

df1['TEMPERATURE'] = df1['TEMPERATURE'].apply(convert_range)
df1['WATER REQUIREMENT'] = df1['WATER REQUIREMENT'].apply(convert_range)

# Preprocess data
X = df1[['CROP TYPE', 'SOIL TYPE', 'REGION', 'TEMPERATURE', 'WEATHER CONDITION']]
y = df1['WATER REQUIREMENT']

# One-hot encode categorical features
X_encoded = pd.get_dummies(X, columns=['CROP TYPE', 'SOIL TYPE', 'REGION', 'WEATHER CONDITION'])

# Split data
X_train, X_test, y_train, y_test = train_test_split(X_encoded, y, test_size=0.2, random_state=42)

# Initialize and train the LinearRegression model
model = LinearRegression()
model.fit(X_train, y_train)

# Evaluate the model
r2_score = model.score(X_test, y_test)
print(f"Linear Regression R² score: {r2_score:.2f}")

# Save the model
# Save the model, along with scaler and column names used during training
joblib.dump(model, 'water_requirement_linear_model.joblib')
joblib.dump(X_encoded.columns, 'model_columns_water.pkl')  # Save column names used for training

print("Linear regression model saved as 'water_requirement_linear_model.pkl'")
