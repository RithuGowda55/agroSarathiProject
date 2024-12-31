import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Back from '../../common/back/Back';

const Irrigation = () => {
  // State to store input data for both models
  const [irrigationData, setIrrigationData] = useState({
    CropType: '',
    CropDays: '',
    SoilMoisture: '',
    temperature: '',
    Humidity: ''
  });

  const [waterData, setWaterData] = useState({
    'CROP TYPE': '',
    'SOIL TYPE': '',
    'REGION': '',
    'TEMPERATURE': '',
    'WEATHER CONDITION': ''
  });
  const navigate = useNavigate();

  const [irrigationPrediction, setIrrigationPrediction] = useState(null);
  const [waterPrediction, setWaterPrediction] = useState(null);
  const [aisuggestion, setAISuggestion] = useState(null);

  // Handle input change for irrigation data
  const handleIrrigationInputChange = (e) => {
    const { name, value } = e.target;
    setIrrigationData({
      ...irrigationData,
      [name]: value
    });
  };

  // Handle input change for water data
  const handleWaterInputChange = (e) => {
    const { name, value } = e.target;
    setWaterData({
      ...waterData,
      [name]: value
    });
  };

  // Function to handle irrigation prediction
  const predictIrrigation = async () => {
    try {
      const response = await axios.post('http://localhost:5000/predict/irrigation', irrigationData);
      setIrrigationPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error predicting irrigation:", error);
    }
  };

  // Function to handle water requirement prediction
  const predictWater = async () => {
    try {
      const response = await axios.post('http://localhost:5000/predict/water', waterData);
      setWaterPrediction(response.data.predicted_water_requirement); // Updated key
    } catch (error) {
      console.error("Error predicting water requirement:", error);
    }
  };
  
  const getIrrigationSuggestion = async () => {
    try {
      const response = await axios.post('http://localhost:5000/suggest/irrigation', {
        inputs: irrigationData,
        irrigation_output: irrigationPrediction,
        water_output: waterPrediction
      });
      setAISuggestion(response.data.suggestion);
    } catch (error) {
      console.error("Error getting irrigation suggestion:", error);
    }
  };

  return (
    <div className="Appp" style={{ margin: "20px" }}>
      <button className="back-button" onClick={() => navigate('/explore')}>
        &#8592;
      </button>
      <Back title='Prediction Tool' />

      {/* Irrigation Prediction Form */}
      <h2 style={{ color: '#1eb2a6', fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Irrigation Prediction</h2>
      <form>
        <input
          type="text"
          name="CropType"
          value={irrigationData.CropType}
          onChange={handleIrrigationInputChange}
          placeholder="Crop Type"
        />
        <input
          type="number"
          name="CropDays"
          value={irrigationData.CropDays}
          onChange={handleIrrigationInputChange}
          placeholder="Crop Days"
        />
        <input
          type="number"
          name="SoilMoisture"
          value={irrigationData.SoilMoisture}
          onChange={handleIrrigationInputChange}
          placeholder="Soil Moisture"
        />
        <input
          type="number"
          name="temperature"
          value={irrigationData.temperature}
          onChange={handleIrrigationInputChange}
          placeholder="Temperature"
        />
        <input
          type="number"
          name="Humidity"
          value={irrigationData.Humidity}
          onChange={handleIrrigationInputChange}
          placeholder="Humidity"
        />
        <button type="button" onClick={predictIrrigation}>Predict Irrigation</button>
      </form>

      {/* Irrigation Prediction Output */}
      {irrigationPrediction !== null && (
        <div
          style={{
            borderRadius: '8px',
            backgroundColor: '#f8f9fa',
            padding: '20px',
            marginTop: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            width: '80%',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <h3 style={{ fontSize: '20px', color: '#4CAF50' }}>Irrigation Prediction</h3>
          <p style={{ fontSize: '16px', color: '#333' }}>
            {irrigationPrediction === 1 ? "Irrigate" : "No Irrigation"}
          </p>
        </div>
      )}

      {/* Water Requirement Prediction Form */}
      <h2 style={{ color: '#1eb2a6', fontSize: '2rem', margin: '2rem', textAlign: 'center' }}>Water Requirement Prediction</h2>
      <form>
        <input
          type="text"
          name="CROP TYPE"
          value={waterData['CROP TYPE']}
          onChange={handleWaterInputChange}
          placeholder="Crop Type"
        />
        <input
          type="text"
          name="SOIL TYPE"
          value={waterData['SOIL TYPE']}
          onChange={handleWaterInputChange}
          placeholder="Soil Type"
        />
        <input
          type="text"
          name="REGION"
          value={waterData['REGION']}
          onChange={handleWaterInputChange}
          placeholder="Region"
        />
        <input
          type="number"
          name="TEMPERATURE"
          value={waterData['TEMPERATURE']}
          onChange={handleWaterInputChange}
          placeholder="Temperature"
        />
        <input
          type="text"
          name="WEATHER CONDITION"
          value={waterData['WEATHER CONDITION']}
          onChange={handleWaterInputChange}
          placeholder="Weather Condition"
        />
        <button type="button" onClick={predictWater}>Predict Water Requirement</button>
      </form>

      {/* Water Requirement Output */}
      {waterPrediction !== null && (
        <div
          style={{
            borderRadius: '8px',
            backgroundColor: '#f8f9fa',
            padding: '20px',
            marginTop: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            width: '80%',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <h3 style={{ fontSize: '20px', color: '#4CAF50' }}>Water Requirement Prediction</h3>
          <p style={{ fontSize: '16px', color: '#333' }}>
            {waterPrediction} mm
          </p>
        </div>
      )}

      {/* AI Suggestion Button and Output */}
      <button type="button" onClick={getIrrigationSuggestion} style={{display:'flex',flexDirection:'column',margin:'21px auto'}}>Get AI Suggestion</button>
      {aisuggestion !== null && (
        <div
          style={{
            borderRadius: '8px',
            backgroundColor: '#f8f9fa',
            padding: '20px',
            marginTop: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            width: '80%',
            maxWidth: '1500px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <h3 style={{ fontSize: '20px', color: '#4CAF50' }}>AI Suggestion</h3>
          <p style={{ fontSize: '16px', color: '#333'}}>
            {aisuggestion}
          </p>
        </div>
      )}

    </div>
  );
};

export default Irrigation;
