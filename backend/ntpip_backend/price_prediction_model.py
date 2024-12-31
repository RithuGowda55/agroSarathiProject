import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
from sklearn.ensemble import RandomForestRegressor

# Load the dataset
df1 = pd.read_csv('../data/price.csv')

# Drop rows with missing values in target columns
df1 = df1.dropna(subset=['Min_x0020_Price', 'Max_x0020_Price', 'Modal_x0020_Price'])

# Preprocess data
X = df1[['State', 'District', 'Market', 'Commodity', 'Variety', 'Grade']]
y = df1[['Min_x0020_Price', 'Max_x0020_Price', 'Modal_x0020_Price']]

# One-hot encode categorical features
X_encoded = pd.get_dummies(X, columns=['State', 'District', 'Market', 'Commodity', 'Variety', 'Grade'])

# Standardize the features only
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_encoded)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestRegressor()
model.fit(X_train, y_train)

# Evaluate the model
r2_score = model.score(X_test, y_test)
print(f"Random Forest Regression R² score: {r2_score:.2f}")

# Save the model and scaler
joblib.dump(model, 'price_predicted.pkl')
joblib.dump(scaler, 'scaler_price.pkl')
joblib.dump(X_encoded.columns, 'price_model_columns.pkl')

print("Random Forest regression model saved as 'price_predicted.pkl'")
