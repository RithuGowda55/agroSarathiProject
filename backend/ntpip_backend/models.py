# models.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

def train_model():
    # Load the dataset
    data = pd.read_csv('../data/Fertilizer Prediction.csv')

    # Define features (X) and target (y)
    X = data[['Temparature', 'Moisture', 'Soil Type', 'Crop Type', 'Nitrogen', 'Potassium', 'Phosphorous']]
    y = data['Fertilizer Name']
    
    # Handle categorical variables (Soil Type and Crop Type)
    X = pd.get_dummies(X, columns=['Soil Type', 'Crop Type'], drop_first=True)
    
    # Split the data into training and testing sets (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Initialize the Random Forest model
    model = RandomForestClassifier(n_estimators=100, random_state=42)

    # Train the model
    model.fit(X_train, y_train)

    # Save the trained model to a file
    joblib.dump(model, 'fertilizer_model.pkl')

    # Print accuracy on the test set
    accuracy = model.score(X_test, y_test)
    print(f"Model trained with accuracy: {accuracy:.2f}")
