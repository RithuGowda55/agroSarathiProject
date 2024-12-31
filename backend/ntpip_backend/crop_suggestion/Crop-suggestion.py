from flask import Flask, request, jsonify, render_template
import requests
import logging
import os

app = Flask(__name__)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

azure_api_key = os.getenv("AZURE_API_KEY")

azure_endpoint = "https://aasare.openai.azure.com/openai/deployments/gpt-4o/chat/completions"
api_version = "2024-08-01-preview"

agro_api_key = "1a2e75d6964345653c6ca5b1fecf7799"

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

if __name__ == '__main__':
    app.run(debug=True)
    
    
