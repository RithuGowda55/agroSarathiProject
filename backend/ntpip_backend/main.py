# from fastapi import FastAPI, File, UploadFile, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# import uvicorn
# import numpy as np
# from io import BytesIO
# from PIL import Image
# import tensorflow as tf
# from dotenv import load_dotenv
# import httpx
# from pydantic import BaseModel
# import os

# from starlette.responses import JSONResponse

# app = FastAPI()

# origins = [
#     "http://127.0.0.1:8000",
#     "http://localhost:3000",
# ]
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Load your TensorFlow model
# MODEL = tf.keras.models.load_model("../plantdisease.keras")

# CLASS_NAMES = [
#     'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust',
#     'Apple___healthy', 'Blueberry___healthy',
#     'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
#     'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
#     'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight',
#     'Corn_(maize)___healthy', 'Grape___Black_rot',
#     'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
#     'Grape___healthy', 'Orange___Haunglongbing_(Citrus_greening)',
#     'Peach___Bacterial_spot', 'Peach___healthy',
#     'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy',
#     'Potato___Early_blight', 'Potato___Late_blight',
#     'Potato___healthy', 'Raspberry___healthy',
#     'Soybean___healthy', 'Squash___Powdery_mildew',
#     'Strawberry___Leaf_scorch', 'Strawberry___healthy',
#     'Tomato___Bacterial_spot', 'Tomato___Early_blight',
#     'Tomato___Late_blight', 'Tomato___Leaf_Mold',
#     'Tomato___Septoria_leaf_spot',
#     'Tomato___Spider_mites Two-spotted_spider_mite',
#     'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
#     'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
# ]

# # load_dotenv()
# # API_KEY = os.getenv("API_KEY")
# # AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT")

# AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT", "https://aasare-new.openai.azure.com/")
# API_KEY = os.getenv("API_KEY", "136dbbe5de1b47fb8507f23ac7d6de29")

# @app.get("/ping")
# async def ping():
#     return "Hello, I am alive"

# def read_file_as_image(data) -> np.ndarray:
#     image = np.array(Image.open(BytesIO(data)))
#     return image

# @app.post("/predict")
# async def predict(file: UploadFile = File(...)):
#     image = read_file_as_image(await file.read())
#     img_batch = np.expand_dims(image, 0)

#     predictions = MODEL.predict(img_batch)

#     predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
#     confidence = np.max(predictions[0])
#     return {
#         'class': predicted_class,
#         'confidence': float(confidence)
#     }

# class Question(BaseModel):
#     question: str

# # from fastapi.responses import JSONResponse

# @app.post("/api/getResponse")
# async def get_response(question: Question):
#     if not API_KEY:
#         raise HTTPException(status_code=500, detail="API_KEY not set")
#     if not AZURE_ENDPOINT:
#         raise HTTPException(status_code=500, detail="AZURE_ENDPOINT not set")

#     question_text = question.question
#     print("Received question:", question_text)

#     payload = {
#         "model": "aasare-new",
#         "messages": [
#             {"role": "system", "content": "You are a helpful assistant."},
#             {"role": "user", "content": question_text},
#         ],
#     }

#     try:
#         # Use retry logic in case of timeout or connection issues
#         async with httpx.AsyncClient(timeout=30) as client:
#             response = await client.post(
#                 f"{AZURE_ENDPOINT}/openai/deployments/aasare-35/chat/completions?api-version=2024-02-15-preview",
#                 json=payload,
#                 headers={
#                     "Content-Type": "application/json",
#                     "api-key": API_KEY,
#                 },
#             )
#             response.raise_for_status()  # Raises error for bad responses (4xx, 5xx)

#         # Extract and return the response content
#         azure_response = response.json()
#         response_content = azure_response.get("choices", [])[0].get("message", {}).get("content", "")
#         if not response_content:
#             raise HTTPException(status_code=500, detail="Invalid response from Azure OpenAI")

#         print("Azure OpenAI response:", response_content)
#         return JSONResponse(content={"response": response_content})

#     except httpx.ConnectTimeout:
#         print("Connection timed out while attempting to reach Azure OpenAI.")
#         raise HTTPException(status_code=504, detail="Connection timed out while reaching Azure OpenAI")

#     except httpx.RequestError as e:
#         print(f"An error occurred while requesting: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error contacting Azure OpenAI: {str(e)}")

#     except Exception as e:
#         print(f"Unexpected error: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

# if __name__ == "__main__":
#     uvicorn.run(app, host='localhost', port=8000)

from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import os
from dotenv import load_dotenv
import requests

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Load your TensorFlow model
MODEL = tf.keras.models.load_model("plantdisease.keras")

CLASS_NAMES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust',
    'Apple___healthy', 'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy', 'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy', 'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy',
    'Potato___Early_blight', 'Potato___Late_blight',
    'Potato___healthy', 'Raspberry___healthy',
    'Soybean___healthy', 'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight',
    'Tomato___Late_blight', 'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
]

# Load environment variables
load_dotenv()
AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT", "https://aasare-new.openai.azure.com/")
API_KEY = os.getenv("API_KEY", "136dbbe5de1b47fb8507f23ac7d6de29")

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.route("/ping", methods=["GET"])
def ping():
    return "Hello, I am alive"

@app.route("/predict", methods=["POST"])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    image = read_file_as_image(file.read())
    img_batch = np.expand_dims(image, 0)

    predictions = MODEL.predict(img_batch)
    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])

    return jsonify({
        'class': predicted_class,
        'confidence': float(confidence)
    })

@app.route("/api/getResponse", methods=["POST"])
def get_response():
    if not API_KEY:
        return make_response(jsonify({"error": "API_KEY not set"}), 500)
    if not AZURE_ENDPOINT:
        return make_response(jsonify({"error": "AZURE_ENDPOINT not set"}), 500)

    question_data = request.get_json()
    if not question_data or 'question' not in question_data:
        return make_response(jsonify({"error": "Invalid input"}), 400)

    question_text = question_data['question']
    print("Received question:", question_text)

    payload = {
        "model": "aasare-new",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": question_text},
        ],
    }

    try:
        response = requests.post(
            f"{AZURE_ENDPOINT}/openai/deployments/aasare-35/chat/completions?api-version=2024-02-15-preview",
            json=payload,
            headers={
                "Content-Type": "application/json",
                "api-key": API_KEY,
            },
            timeout=30
        )
        response.raise_for_status()  # Raises error for bad responses (4xx, 5xx)

        azure_response = response.json()
        response_content = azure_response.get("choices", [])[0].get("message", {}).get("content", "")
        if not response_content:
            return make_response(jsonify({"error": "Invalid response from Azure OpenAI"}), 500)

        print("Azure OpenAI response:", response_content)
        return jsonify({"response": response_content})

    except requests.exceptions.Timeout:
        print("Connection timed out while attempting to reach Azure OpenAI.")
        return make_response(jsonify({"error": "Connection timed out"}), 504)

    except requests.exceptions.RequestException as e:
        print(f"An error occurred while requesting: {str(e)}")
        return make_response(jsonify({"error": f"Error contacting Azure OpenAI: {str(e)}"}), 500)

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return make_response(jsonify({"error": f"Unexpected error: {str(e)}"}), 500)

if __name__ == "__main__":
    app.run(host="localhost", port=8000)

