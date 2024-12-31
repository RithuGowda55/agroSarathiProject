import axios from 'axios';

export const predictFertilizer = async (data) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/predict-fertilizer`, data);
    return response.data.fertilizer_prediction;
  } catch (error) {
    console.error("Error predicting fertilizer", error);
    return null;
  }
};
