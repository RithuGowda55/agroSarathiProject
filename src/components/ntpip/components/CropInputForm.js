import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making requests
import Back from '../../common/back/Back';
import './CropInputForm.css'; // Import the CSS file

const CropInputForm = () => {
  const [formData, setFormData] = useState({
    temperature: '',
    moisture: '',
    nitrogen: '',
    potassium: '',
    phosphorous: '',
    soilType: '',
    cropType: '',
  });

  const [prediction, setPrediction] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/predict-fertilizer', formData);
      setPrediction(response.data.fertilizer_prediction);  // assuming the response contains the prediction
    } catch (error) {
      console.error("Error predicting fertilizer:", error);
      setPrediction('Error: Could not get prediction');
    }
  };

  return (
    <div className="containerr">
      <Back title='Fertilizer Prediction' />
      <button className="back-button" onClick={() => navigate('/explore')}>
        &#8592;
      </button>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="temperature"
          placeholder="Temperature (°C)"
          onChange={handleChange}
        />
        <input
          type="number"
          name="moisture"
          placeholder="Moisture Content (%)"
          onChange={handleChange}
        />
        <input
          type="number"
          name="nitrogen"
          placeholder="Nitrogen Content (kg)"
          onChange={handleChange}
        />
        <input
          type="number"
          name="potassium"
          placeholder="Potassium Content (kg)"
          onChange={handleChange}
        />
        <input
          type="number"
          name="phosphorous"
          placeholder="Phosphorous Content (kg)"
          onChange={handleChange}
        />
        <input
          type="text"
          name="soilType"
          placeholder="Soil Type"
          onChange={handleChange}
        />
        <input
          type="text"
          name="cropType"
          placeholder="Crop Type"
          onChange={handleChange}
        />
        <button type="submit" className='btn'>Predict Fertilizer</button>
      </form>

      {/* {prediction && <p className="prediction">Recommended Fertilizer: {prediction}</p>} */}
      {prediction && (
  <div
    className="prediction-card"
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
    <h3 style={{ fontSize: '20px', color: '#4CAF50' }}>Recommended Fertilizer</h3>
    <p style={{ fontSize: '16px', color: '#333' }}>{prediction}</p>
  </div>
)}

    </div>
  );
};

export default CropInputForm;
