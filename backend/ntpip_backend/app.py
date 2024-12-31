# from flask import Flask, request, jsonify
# import joblib
# import pandas as pd
# from flask_cors import CORS
# import pickle
# import os
# from dotenv import load_dotenv
# from flask_pymongo import PyMongo
# import openai
# import aiohttp
# import asyncio
# # from labor_management.routes.labor_profile_routes import labor_profile_bp

# # Initialize PyMongo

# ##########################################Labor Management#########################################
# from flask import Flask
# from flask_cors import CORS
# load_dotenv()

# #########################################################################################################################

# # Initialize the Flask application
# app = Flask(__name__)
# CORS(app, supports_credentials=True)
# # app.register_blueprint(labor_profile_bp, url_prefix='/api')
# app.config["MONGO_URI"] = os.getenv("MONGO_URI")
# api_key = os.getenv("api_key")
# azure_endpoint = "https://aasare-new.openai.azure.com/"
# api_version = "2024-02-15-preview"

# mongo = PyMongo(app)

# # Load the trained models
# water_model = joblib.load('water_requirement_model.pkl')  # Water requirement model from CSV 1
# irrigation_model = joblib.load('irrigation_model.pkl')    # Irrigation model from CSV 2

# @app.route('/')
# def home():
#     return "Welcome to the AgroSarathi Fertilizer and Irrigation Prediction API!"

# @app.route('/predict-fertilizer', methods=['POST'])
# def predict_fertilizer():
#     try:
#         model = joblib.load('fertilizer_model.pkl')

#         # Get input data from the POST request (JSON format)
#         data = request.json
        
#         # Ensure the input contains all necessary fields
#         required_fields = ['temperature', 'moisture', 'soilType', 'cropType', 'nitrogen', 'potassium', 'phosphorous']
#         for field in required_fields:
#             if field not in data:
#                 return jsonify({'error': f'Missing required field: {field}'}), 400

#         # Convert the input data to a pandas DataFrame
#         df = pd.DataFrame([data])

#         # Rename columns to match the trained model's columns
#         df = df.rename(columns={
#             'temperature': 'Temparature', 
#             'moisture': 'Moisture', 
#             'nitrogen': 'Nitrogen', 
#             'potassium': 'Potassium', 
#             'phosphorous': 'Phosphorous', 
#             'soilType': 'Soil Type', 
#             'cropType': 'Crop Type'
#         })
        
#         # Perform one-hot encoding for 'Soil Type' and 'Crop Type'
#         df = pd.get_dummies(df, columns=['Soil Type', 'Crop Type'], drop_first=True)

#         # Ensure the DataFrame has the same columns as the training set
#         model_columns = ['Temparature', 'Moisture', 'Nitrogen', 'Potassium', 'Phosphorous',
#                          'Soil Type_Clayey', 'Soil Type_Loamy', 'Soil Type_Red', 'Soil Type_Sandy',
#                          'Crop Type_Cotton', 'Crop Type_Ground Nuts', 'Crop Type_Maize', 'Crop Type_Millets',
#                          'Crop Type_Oil seeds', 'Crop Type_Paddy', 'Crop Type_Pulses', 'Crop Type_Sugarcane',
#                          'Crop Type_Tobacco', 'Crop Type_Wheat']

#         # Add missing columns and set them to 0 (for cases where some one-hot encoded features may be missing in new data)
#         for col in model_columns:
#             if col not in df.columns:
#                 df[col] = 0

#         # Ensure the columns are in the same order as the training set
#         df = df[model_columns]

#         # Make the prediction
#         prediction = model.predict(df)

#         # Return the predicted fertilizer name
#         return jsonify({'fertilizer_prediction': prediction[0]})
    
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/predict/irrigation', methods=['POST'])
# def predict_irrigation():
#     try:
#         # Load the saved model, scaler, and column names
#         model = joblib.load('irrigation_logistic_model.joblib')
#         scaler = joblib.load('scaler.pkl')
#         model_columns = joblib.load('model_columns_irrigation.pkl')  # Load the saved column names

#         data = request.json
#         print("Received irrigation data:", data)

#         required_fields = ['CropType', 'CropDays', 'SoilMoisture', 'temperature', 'Humidity']
#         for field in required_fields:
#             if field not in data:
#                 return jsonify({'error': f'Missing required field: {field}'}), 400
        
#         # Prepare new input data
#         df = pd.DataFrame([data])

#         # One-hot encode the categorical feature 'CropType'
#         new_data_encoded = pd.get_dummies(df, columns=['CropType'])

#         # Ensure the new data has the same columns as the training data
#         for col in model_columns:
#             if col not in new_data_encoded.columns:
#                 new_data_encoded[col] = 0  # Add missing columns with 0s

#         # Reorder columns to match the model's training format
#         new_data_encoded = new_data_encoded[model_columns]

#         # Scale the input data using the saved scaler
#         new_data_scaled = scaler.transform(new_data_encoded)

#         # Make prediction
#         prediction = model.predict(new_data_scaled)
#         prediction_result = 'Yes' if prediction[0] == 1 else 'No'

#         return jsonify({'prediction': prediction_result})

#     except Exception as e:
#         print(f"Error in predict_irrigation: {str(e)}")  # Log the error
#         return jsonify({'error': str(e)}), 500

# @app.route('/predict/water', methods=['POST'])
# def predict_water():
#     try:
#         model = joblib.load('water_requirement_linear_model.joblib')
#         model_columns = joblib.load('model_columns_water.pkl')  # Assuming you saved columns during training

#         data = request.json

#         print("water data")
#         print(data)

#         required_fields = ['CROP TYPE', 'SOIL TYPE', 'REGION', 'TEMPERATURE', 'WEATHER CONDITION']
#         for field in required_fields:
#             if field not in data:
#                 return jsonify({'error': f'Missing required field: {field}'}), 400

#         df = pd.DataFrame([data])

#         # One-hot encode the categorical features in the new data
#         new_data_encoded = pd.get_dummies(df, columns=['CROP TYPE', 'SOIL TYPE', 'REGION', 'WEATHER CONDITION'])

#         # Ensure the new data has the same columns as the training data
#         for col in model_columns:
#             if col not in new_data_encoded.columns:
#                 new_data_encoded[col] = 0

#         # Reorder columns to match the model's training format
#         new_data_encoded = new_data_encoded[model_columns]

#         # Make a prediction
#         predicted_water_requirement = model.predict(new_data_encoded)
#         value = round(predicted_water_requirement[0], 2)
#         print(f"Predicted Water Requirement: {value}")
        
#         return jsonify({'predicted_water_requirement': value})

#     except Exception as e:
#         print(f"Error in water: {str(e)}")  # Log the error
#         return jsonify({'error': str(e)}), 500

# @app.route('/predict/price', methods=['POST'])
# def predict():
#     model = joblib.load('price_predicted.pkl')
#     scaler = joblib.load('scaler_price.pkl')
#     model_columns = joblib.load('price_model_columns.pkl')
#     # Get data from the request
#     data = request.json
    
#     # Convert the incoming data into a DataFrame for consistent structure
#     df = pd.DataFrame([data])

#     # One-hot encode the input data to match the training data
#     df_encoded = pd.get_dummies(df, columns=['State', 'District', 'Market', 'Commodity', 'Variety', 'Grade'])
    
#     # Align the columns with the model's expected columns
#     df_encoded = df_encoded.reindex(columns=model_columns, fill_value=0)
    
#     # Scale the data using the same scaler used during training
#     scaled_data = scaler.transform(df_encoded)
    
#     # Make predictions
#     prediction = model.predict(scaled_data)
    
#     # Return the predictions as a JSON response
#     result = {
#         'Min_Price': prediction[0][0],
#         'Max_Price': prediction[0][1],
#         'Modal_Price': prediction[0][2]
#     }
#     return jsonify(result)

# async def get_irrigation_response(prompt):
#     headers = {
#         'Content-Type': 'application/json',
#         'api-key': api_key,
#     }
#     data = {
#         "model": "aasare-new",
#         "messages": [
#             {"role": "system", "content": "You are an expert in irrigation strategies."},
#             {"role": "user", "content": prompt},
#         ]
#     }
#     async with aiohttp.ClientSession() as session:
#         async with session.post(f"{azure_endpoint}openai/deployments/aasare-35/chat/completions?api-version={api_version}", headers=headers, json=data) as response:
#             if response.status == 200:
#                 response_json = await response.json()
#                 return response_json['choices'][0]['message']['content']
#             else:
#                 return None

# def run_async(func, *args):
#     return asyncio.run(func(*args))

# @app.route('/suggest/irrigation', methods=['POST'])
# def suggest_irrigation():
    
#     data = request.json
#     print("Received data:", data)
#     input_params = data.get("inputs")
#     irrigation_output = data.get("irrigation_output")
#     water_output = data.get("water_output")

#     print("Input parameters:", input_params)
#     print("Irrigation Output:", irrigation_output)
#     print("Water Output:", water_output)
#     # Combine inputs and outputs into a prompt
    
    
#     prompt = f"""
#     Given the following parameters:
#     - Crop Type: {input_params['CropType']}
#     - Crop Days: {input_params['CropDays']}
#     - Soil Moisture: {input_params['SoilMoisture']}
#     - Temperature: {input_params['temperature']}
#     - Humidity: {input_params['Humidity']}
#     - Water Requirement Prediction: {water_output}
#     - Irrigation Prediction: {'Irrigate' if irrigation_output == 1 else 'No Irrigation'}

#     Suggest the best irrigation strategy for the crop.
#     """
#     print("Generated prompt:", prompt)

#     # Call async function in sync context
#     response = run_async(get_irrigation_response, prompt)

#     if response:
#         return jsonify({"suggestion": response})
#     else:
#         return jsonify({"suggestion": "Unable to generate irrigation suggestion."})

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify,render_template
import requests
import logging
import joblib
import pandas as pd
from flask_cors import CORS
import pickle
import os
from dotenv import load_dotenv
from flask_pymongo import PyMongo
import openai
import aiohttp
import asyncio
# from labor_management.routes.labor_profile_routes import labor_profile_bp

# Initialize PyMongo

##########################################Labor Management#########################################
from flask import Flask
from flask_cors import CORS
load_dotenv()

#########################################################################################################################

# Initialize the Flask application
app = Flask(__name__)
CORS(app, supports_credentials=True)
# app.register_blueprint(labor_profile_bp, url_prefix='/api')
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
api_keyy = os.getenv("api_key")
azure_endpointt = "https://aasare-new.openai.azure.com/"
api_versionn = "2024-02-15-preview"

################################################crop suggestion###########################################################
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

azure_api_key = os.getenv("AZURE_API_KEY")

azure_endpoint = "https://aasare.openai.azure.com/openai/deployments/gpt-4o/chat/completions"
api_version = "2024-08-01-preview"

agro_api_key = "1a2e75d6964345653c6ca5b1fecf7799"

# azure_api_key = os.getenv("AZURE_API_KEY")

# azure_endpoint = "https://aasare-new.openai.azure.com/"
# api_version = "2024-02-15-preview"

# agro_api_key = "1a2e75d6964345653c6ca5b1fecf7799"

mongo = PyMongo(app)

# Load the trained models
water_model = joblib.load('water_requirement_model.pkl')  # Water requirement model from CSV 1
irrigation_model = joblib.load('irrigation_model.pkl')    # Irrigation model from CSV 2

def get_coordinates(region_name):
    try:
        response = requests.get(
            'https://nominatim.openstreetmap.org/search',
            params={'q': region_name, 'format': 'json', 'limit': 1},
            headers={'User-Agent': 'YourAppName'}
        )
        response.raise_for_status()
        data = response.json()
        if data:
            lat = float(data[0]['lat'])
            lon = float(data[0]['lon'])
            logging.info(f"Fetched coordinates for {region_name}: Lat {lat}, Lon {lon}")
            return lat, lon
    except Exception as e:
        logging.error(f"Error during Nominatim request: {e}")
    return None, None

def get_weather_forecast(lat, lon):
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current_weather": True,
        "hourly": [
            "temperature_2m", "relative_humidity_2m", "precipitation",
            "pressure_msl", "cloud_cover", "wind_speed_10m", "soil_moisture_0_to_1cm"
        ],
        "daily": [
            "temperature_2m_max", "temperature_2m_min", "sunshine_duration",
            "uv_index_max", "precipitation_sum", "et0_fao_evapotranspiration",
            "relative_humidity_2m_min", "relative_humidity_2m_max"
        ],
        "timezone": "GMT",
        "forecast_days": 1
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        weather_data = response.json()
        logging.info(f"Weather Forecast: {weather_data}")
        return weather_data
    except Exception as e:
        logging.error(f"Error fetching weather data: {e}")
        return None

def create_polygon(api_key, coordinates, name="Temporary Polygon"):
    url = f"http://api.agromonitoring.com/agro/1.0/polygons?duplicated=true&appid={api_key}"
    headers = {'Content-Type': 'application/json'}
    
    payload = {
        "name": name,
        "geo_json": {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [coordinates]
            }
        }
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        polygon_info = response.json()
        logging.info(f"Polygon created with ID: {polygon_info['id']}")
        return polygon_info['id']
    except requests.exceptions.HTTPError as http_err:
        logging.error(f"HTTP error during polygon creation: {http_err}")
        if response.text:
            logging.error(f"Response Text: {response.text}")
    except Exception as err:
        logging.error(f"An error occurred during polygon creation: {err}")
    
    return None

def delete_polygon(api_key, polygon_id):
    url = f"http://api.agromonitoring.com/agro/1.0/polygons/{polygon_id}?appid={api_key}"
    try:
        response = requests.delete(url)
        response.raise_for_status()
        logging.info(f"Polygon {polygon_id} deleted successfully.")
    except Exception as e:
        logging.error(f"Error deleting polygon {polygon_id}: {e}")

def get_soil_data_by_polygon(polyid, api_key):
    try:
        url = f"http://api.agromonitoring.com/agro/1.0/soil"
        params = {
            "polyid": polyid,
            "appid": api_key
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        soil_data = response.json()
        logging.info(f"Soil Data: {soil_data}")
        
        if soil_data:
            soil_info = {
                "Calculation Time": soil_data.get('dt', 'Unavailable'),
                "Temperature (10 cm depth, K)": soil_data.get('t10', 'Unavailable'),
                "Soil Moisture (m3/m3)": soil_data.get('moisture', 'Unavailable'),
                "Surface Temperature (K)": soil_data.get('t0', 'Unavailable')
            }
            logging.info(f"Soil Properties: {soil_info}")
            return soil_info
        else:
            logging.warning("No soil data found for the given polygon.")
            return None

    except requests.exceptions.HTTPError as http_err:
        logging.error(f"HTTP error occurred while fetching soil data: {http_err}")
    except Exception as err:
        logging.error(f"An error occurred while fetching soil data: {err}")

    return None

def manage_polygon_and_fetch_soil(api_key, coordinates):
    polyid = create_polygon(api_key, coordinates)
    if polyid:
        soil_data = get_soil_data_by_polygon(polyid, api_key)
        delete_polygon(api_key, polyid) 
        return soil_data
    return None

def generate_soil_type(weather_data, soil_data):
    prompt = (
        f"Using this weather data: {weather_data} and soil data: {soil_data}, "
        f"determine the probable soil type for the given region."
    )
    try:
        response = requests.post(
            f"{azure_endpoint}?api-version={api_version}",
            headers={'Content-Type': 'application/json', 'api-key': azure_api_key},
            json={
                "model": "gpt-4o",
                "messages": [
                    {"role": "system", "content": "You are an agricultural soil analyst."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 500
            }
        )
        response_data = response.json()
        if 'choices' in response_data and response_data['choices']:
            logging.info(f"Soil Type Response: {response_data['choices'][0]['message']['content']}")
            return response_data['choices'][0]['message']['content'].strip()
        else:
            logging.warning("No specific soil type returned from Azure response.")
            return None
    except Exception as e:
        logging.error(f"Error using Azure OpenAI API: {e}")
        return None

def generate_crop_suggestions(weather_data, soil_data, region):
    prompt = (
        f"Based on the weather data: {weather_data['daily']} and soil data: {soil_data} for the region: {region}, "
        f"list the top 4 suitable crops for planting. Present the output as plain text numbers and details in simple language. "
        f"Each crop should include a reason why it is suitable without formatting characters like asterisks or hashes."
    )
    try:
        response = requests.post(
            f"{azure_endpoint}?api-version={api_version}",
            headers={'Content-Type': 'application/json', 'api-key': azure_api_key},
            json={
                "model": "gpt-4o",
                "messages": [
                    {"role": "system", "content": "You are an agricultural expert writing in plain text."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 600
            }
        )
        response_data = response.json()
        logging.info(f"Azure OpenAI Crop Suggestions Response: {response_data}")
        if 'choices' in response_data and response_data['choices']:
            return response_data['choices'][0]['message']['content'].strip()
        else:
            logging.warning("No specific crop suggestions returned from Azure response.")
            return None
    except Exception as e:
        logging.error(f"Error using Azure OpenAI API: {e}")
        return None
    
def generate_maintenance_tips(weather_data, soil_data, crop_type):
    prompt = (
        f"With the upcoming 15 days of weather (average temperature, precipitation, humidity, etc.): {weather_data['daily']} "
        f"and current soil conditions: {soil_data}, provide practical maintenance tips for {crop_type}. "
        f"Use simple language. Convert technical measurements into everyday terms the average farmer can easily understand. "
        f"Focus on delivering clear actions like watering, fertilization, and pest control without using specific metrics. "
        f"Suggest everyday analogies (e.g., a cup of water) for any measurements if necessary."
    )
    try:
        response = requests.post(
            f"{azure_endpoint}?api-version={api_version}",
            headers={'Content-Type': 'application/json', 'api-key': azure_api_key},
            json={
                "model": "gpt-4o",
                "messages": [
                    {"role": "system", "content": "You are an agricultural expert providing simple guidance."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 500 
            }
        )
        response_data = response.json()
        logging.info(f"Azure OpenAI Maintenance Tips Response: {response_data}")
        
        if 'choices' in response_data and response_data['choices']:
            return response_data['choices'][0]['message']['content'].strip()
        else:
            logging.warning("No specific maintenance tips returned from Azure response.")
            return None
    except Exception as e:
        logging.error(f"Error generating maintenance tips with Azure OpenAI API: {e}")
        return None



@app.route('/')
def home():
    return "Welcome to the AgroSarathi Fertilizer and Irrigation Prediction API!"

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process_data():
    data = request.json
    region = data['region']
    choice = data.get('choice') 
    crop_type = data.get('crop_type', '') 

    lat, lon = get_coordinates(region)
    if not (lat and lon):
        return jsonify({'error_message': "Unable to determine location coordinates."}), 500

    weather_forecast = get_weather_forecast(lat, lon)
    if not weather_forecast:
        return jsonify({'error_message': "Unable to retrieve weather data."}), 500

    half_degree = 0.005
    coordinates = [
        [lon - half_degree, lat - half_degree],
        [lon + half_degree, lat - half_degree],
        [lon + half_degree, lat + half_degree],
        [lon - half_degree, lat + half_degree],
        [lon - half_degree, lat - half_degree]
    ]

    soil_properties = manage_polygon_and_fetch_soil(agro_api_key, coordinates)
    if not soil_properties:
        return jsonify({'error_message': "Unable to retrieve soil data."}), 500

    result = {}
    if choice == 'maintenance_tips' and crop_type:
        maintenance_tips = generate_maintenance_tips(weather_forecast, soil_properties, crop_type)
        result['maintenance_tips'] = maintenance_tips
    elif choice == 'crop_suggestions':
        soil_type = generate_soil_type(weather_forecast, soil_properties)
        crop_suggestions = generate_crop_suggestions(weather_forecast, soil_properties, region)
        result = {
            'soil_properties': soil_properties,
            'weather_forecast': weather_forecast,
            'soil_type': soil_type,
            'crop_suggestions': crop_suggestions
        }
    else:
        result['error_message'] = "Invalid choice or missing crop type for maintenance tips."

    logging.info(f"Final Result: {result}")
    return jsonify(result)

@app.route('/predict-fertilizer', methods=['POST'])
def predict_fertilizer():
    try:
        model = joblib.load('fertilizer_model.pkl')

        # Get input data from the POST request (JSON format)
        data = request.json
        
        # Ensure the input contains all necessary fields
        required_fields = ['temperature', 'moisture', 'soilType', 'cropType', 'nitrogen', 'potassium', 'phosphorous']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Convert the input data to a pandas DataFrame
        df = pd.DataFrame([data])

        # Rename columns to match the trained model's columns
        df = df.rename(columns={
            'temperature': 'Temparature', 
            'moisture': 'Moisture', 
            'nitrogen': 'Nitrogen', 
            'potassium': 'Potassium', 
            'phosphorous': 'Phosphorous', 
            'soilType': 'Soil Type', 
            'cropType': 'Crop Type'
        })
        
        # Perform one-hot encoding for 'Soil Type' and 'Crop Type'
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

        # Make the prediction
        prediction = model.predict(df)

        # Return the predicted fertilizer name
        return jsonify({'fertilizer_prediction': prediction[0]})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict/irrigation', methods=['POST'])
def predict_irrigation():
    try:
        # Load the saved model, scaler, and column names
        model = joblib.load('irrigation_logistic_model.joblib')
        scaler = joblib.load('scaler.pkl')
        model_columns = joblib.load('model_columns_irrigation.pkl')  # Load the saved column names

        data = request.json
        print("Received irrigation data:", data)

        required_fields = ['CropType', 'CropDays', 'SoilMoisture', 'temperature', 'Humidity']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Prepare new input data
        df = pd.DataFrame([data])

        # One-hot encode the categorical feature 'CropType'
        new_data_encoded = pd.get_dummies(df, columns=['CropType'])

        # Ensure the new data has the same columns as the training data
        for col in model_columns:
            if col not in new_data_encoded.columns:
                new_data_encoded[col] = 0  # Add missing columns with 0s

        # Reorder columns to match the model's training format
        new_data_encoded = new_data_encoded[model_columns]

        # Scale the input data using the saved scaler
        new_data_scaled = scaler.transform(new_data_encoded)

        # Make prediction
        prediction = model.predict(new_data_scaled)
        prediction_result = 'Yes' if prediction[0] == 1 else 'No'

        return jsonify({'prediction': prediction_result})

    except Exception as e:
        print(f"Error in predict_irrigation: {str(e)}")  # Log the error
        return jsonify({'error': str(e)}), 500

@app.route('/predict/water', methods=['POST'])
def predict_water():
    try:
        model = joblib.load('water_requirement_linear_model.joblib')
        model_columns = joblib.load('model_columns_water.pkl')  # Assuming you saved columns during training

        data = request.json

        print("water data")
        print(data)

        required_fields = ['CROP TYPE', 'SOIL TYPE', 'REGION', 'TEMPERATURE', 'WEATHER CONDITION']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        df = pd.DataFrame([data])

        # One-hot encode the categorical features in the new data
        new_data_encoded = pd.get_dummies(df, columns=['CROP TYPE', 'SOIL TYPE', 'REGION', 'WEATHER CONDITION'])

        # Ensure the new data has the same columns as the training data
        for col in model_columns:
            if col not in new_data_encoded.columns:
                new_data_encoded[col] = 0

        # Reorder columns to match the model's training format
        new_data_encoded = new_data_encoded[model_columns]

        # Make a prediction
        predicted_water_requirement = model.predict(new_data_encoded)
        value = round(predicted_water_requirement[0], 2)
        print(f"Predicted Water Requirement: {value}")
        
        return jsonify({'predicted_water_requirement': value})

    except Exception as e:
        print(f"Error in water: {str(e)}")  # Log the error
        return jsonify({'error': str(e)}), 500

@app.route('/predict/price', methods=['POST'])
def predict():
    model = joblib.load('price_predicted.pkl')
    scaler = joblib.load('scaler_price.pkl')
    model_columns = joblib.load('price_model_columns.pkl')
    # Get data from the request
    data = request.json
    
    # Convert the incoming data into a DataFrame for consistent structure
    df = pd.DataFrame([data])

    # One-hot encode the input data to match the training data
    df_encoded = pd.get_dummies(df, columns=['State', 'District', 'Market', 'Commodity', 'Variety', 'Grade'])
    
    # Align the columns with the model's expected columns
    df_encoded = df_encoded.reindex(columns=model_columns, fill_value=0)
    
    # Scale the data using the same scaler used during training
    scaled_data = scaler.transform(df_encoded)
    
    # Make predictions
    prediction = model.predict(scaled_data)
    
    # Return the predictions as a JSON response
    result = {
        'Min_Price': prediction[0][0],
        'Max_Price': prediction[0][1],
        'Modal_Price': prediction[0][2]
    }
    return jsonify(result)

async def get_irrigation_response(prompt):
    headers = {
        'Content-Type': 'application/json',
        'api-key': api_keyy,
    }
    data = {
        "model": "aasare-new",
        "messages": [
            {"role": "system", "content": "You are an expert in irrigation strategies."},
            {"role": "user", "content": prompt},
        ]
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(f"{azure_endpointt}openai/deployments/aasare-35/chat/completions?api-version={api_versionn}", headers=headers, json=data) as response:
            if response.status == 200:
                response_json = await response.json()
                return response_json['choices'][0]['message']['content']
            else:
                return None

def run_async(func, *args):
    return asyncio.run(func(*args))

@app.route('/suggest/irrigation', methods=['POST'])
def suggest_irrigation():
    
    data = request.json
    print("Received data:", data)
    input_params = data.get("inputs")
    irrigation_output = data.get("irrigation_output")
    water_output = data.get("water_output")

    print("Input parameters:", input_params)
    print("Irrigation Output:", irrigation_output)
    print("Water Output:", water_output)
    # Combine inputs and outputs into a prompt
    
    
    prompt = f"""
    Given the following parameters:
    - Crop Type: {input_params['CropType']}
    - Crop Days: {input_params['CropDays']}
    - Soil Moisture: {input_params['SoilMoisture']}
    - Temperature: {input_params['temperature']}
    - Humidity: {input_params['Humidity']}
    - Water Requirement Prediction: {water_output}
    - Irrigation Prediction: {'Irrigate' if irrigation_output == 1 else 'No Irrigation'}

    Suggest the best irrigation strategy for the crop.
    """
    print("Generated prompt:", prompt)

    # Call async function in sync context
    response = run_async(get_irrigation_response, prompt)
    print("Response:",response)

    if response:
        return jsonify({"suggestion": response})
    else:
        return jsonify({"suggestion": "Unable to generate irrigation suggestion."})

if __name__ == '__main__':
    app.run(debug=True)