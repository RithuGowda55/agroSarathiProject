import React, { useState } from 'react';
import Back from '../common/back/Back';

const Cropsuggest = () => {
  const [region, setRegion] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState('crop_suggestions');
  const [cropType, setCropType] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegionInput = (e) => {
    const query = e.target.value.trim();
    setRegion(query);

    if (query.length > 2) {
      fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=IN&addressdetails=1&limit=10`
      )
        .then((response) => response.json())
        .then((data) => {
          setSuggestions(data);
        })
        .catch((error) => console.error('Error fetching suggestions:', error));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (displayName) => {
    setRegion(displayName);
    setSuggestions([]);
  };

  const handleGetSuggestions = () => {
    setIsLoading(true);
    fetch('http://localhost:5000/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        region,
        choice: selectedChoice,
        crop_type: cropType,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        console.log('API Response:', data);

        if (data.error_message) {
          setResults([{ text: data.error_message, isError: true }]);
        } else {
          // Handle crop suggestions
          if (data.crop_suggestions) {
            setResults([
              { text: `Soil Properties: ${JSON.stringify(data.soil_properties)}`, isError: false },
              { text: `Weather Forecast: ${JSON.stringify(data.weather_forecast)}`, isError: false },
              { text: `Soil Type: ${data.soil_type}`, isError: false },
              ...data.crop_suggestions.split('\n').map((crop) => ({ text: crop, isError: false })),
            ]);
          }
          // Handle maintenance tips
          else if (data.maintenance_tips) {
            setResults(
              data.maintenance_tips
                ? data.maintenance_tips.split('\n').map((tip) => ({ text: tip, isError: false }))
                : [{ text: 'No maintenance tips found', isError: true }]
            );
          } else {
            setResults([{ text: 'No results found', isError: true }]);
          }
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Error fetching suggestions:', error);
        setResults([{ text: 'Failed to fetch suggestions', isError: true }]);
      });
  };

  return (
    <>
    <Back title='Crop Suggestion ' />
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* <h1>Crop Suggestion App</h1> */}
      <div style={{ position: 'relative', width: '300px', marginBottom: '20px' }}>
        <label htmlFor="region" style={{ display: 'block', marginBottom: '8px' }}>
          Region:
        </label>
        <input
          type="text"
          id="region"
          name="region"
          value={region}
          onChange={handleRegionInput}
          style={{
            width: '100%',
            padding: '8px',
            boxSizing: 'border-box',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        {suggestions.length > 0 && (
          <ul
            style={{
              position: 'absolute',
              width: '100%',
              border: '1px solid #ccc',
              backgroundColor: 'white',
              maxHeight: '150px',
              overflowY: 'auto',
              listStyleType: 'none',
              padding: '0',
              margin: '0',
              zIndex: '1000',
            }}
          >
            {suggestions.map((entry) => (
              <li
                key={entry.place_id}
                onClick={() => handleSuggestionClick(entry.display_name)}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
                onMouseOut={(e) => (e.target.style.backgroundColor = 'white')}
              >
                {entry.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="choice" style={{ display: 'block', marginBottom: '8px' }}>
          Select Option:
        </label>
        <select
          id="choice"
          value={selectedChoice}
          onChange={(e) => setSelectedChoice(e.target.value)}
          style={{
            padding: '8px',
            width: '100%',
            boxSizing: 'border-box',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          <option value="crop_suggestions">Crop Suggestions</option>
          <option value="maintenance_tips">Maintenance Tips</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="crop-type" style={{ display: 'block', marginBottom: '8px' }}>
          Crop Type:
        </label>
        <input
          type="text"
          id="crop-type"
          name="crop-type"
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            boxSizing: 'border-box',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      </div>

      <button
        onClick={handleGetSuggestions}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Get Suggestions'}
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3>Final Results</h3>
        {results.length === 0 && !isLoading ? (
          <p style={{ color: '#666' }}>No results to display</p>
        ) : (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px',
              marginTop: '20px',
            }}
          >
            {results.map((result, index) => (
              <div
                key={index}
                style={{
                  border: result.isError ? '1px solid red' : '1px solid #ccc',
                  padding: '10px',
                  borderRadius: '4px',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                  backgroundColor: result.isError ? '#ffe6e6' : '#f9f9f9',
                  flex: '1 1 calc(30% - 20px)',
                  minHeight: '50px',
                }}
              >
                {result.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Cropsuggest;
