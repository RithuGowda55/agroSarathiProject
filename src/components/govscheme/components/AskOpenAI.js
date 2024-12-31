import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import './AskOpenAI.css'; // Import the CSS file

const AskOpenAI = () => {
  const navigate = useNavigate();  // Initialize useNavigate hook
  const [openaiPrompt, setOpenaiPrompt] = useState('');  // State for storing user input
  const [openaiResponse, setOpenaiResponse] = useState(''); // State for storing OpenAI response
  const [isLoading, setIsLoading] = useState(false); // State for loading status
  const [error, setError] = useState(''); // State for error handling
  const [isResponseReceived, setIsResponseReceived] = useState(false); // State to track response

  // Function to handle the OpenAI request
  const handleOpenAIRequest = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    setIsLoading(true); // Set loading to true while waiting for response
    setError(''); // Reset any previous error
    setIsResponseReceived(false); // Reset response state before requesting

    try {
      // Send request to OpenAI with the prompt
      const response = await axios.post('http://localhost:8090/api/openai', {
        question: openaiPrompt || "Can you provide details of government schemes related to agriculture for low-income farmers, including the scheme name, description, state, crop type, income level, eligibility, amount, application deadline, contact information, and website link? Please list at least 5 schemes.",  // Default prompt if the user doesn't provide one
      });

      // Set OpenAI's response to state
      setOpenaiResponse(response.data.response);
      setIsResponseReceived(true); // Set the response state to true when response is received
    } catch (err) {
      console.error('Error fetching OpenAI response:', err);
      setError('An error occurred while fetching the response. Please try again later.');
    } finally {
      setIsLoading(false); // Set loading to false after the request is completed
    }
  };

  // Function to handle copying the prompt
  const handleCopyPrompt = (prompt) => {
    navigator.clipboard.writeText(prompt)
      .then(() => alert('Prompt copied to clipboard!'))
      .catch((err) => console.error('Error copying text: ', err));
  };

  // Function to navigate back to the previous page
  const goBack = () => {
    navigate(-1);  // This takes the user back to the previous page
  };

  return (
    <div className="ask-openai-container">
      <button className="back-button" onClick={goBack}>
        &#8592; {/* Left arrow symbol */}
      </button>
      <h2>Ask OpenAI</h2>
      <form onSubmit={handleOpenAIRequest} className='form1'>
        <div>
          <textarea
            value={openaiPrompt}
            onChange={(e) => setOpenaiPrompt(e.target.value)}
            placeholder="Ask about recent schemes"
            style={{ width: '507px', height: '150px', padding: '10px', fontSize: '16px', resize: 'both', boxSizing: 'border-box' }} // Making it resizable
          />
        </div>
        <div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Ask OpenAI'}
          </button>
        </div>
      </form>

      {/* Display OpenAI response */}
      {openaiResponse && (
        <div className="response-container">
          <h4>OpenAI Response:</h4>
          <div
            className="response-content"
            dangerouslySetInnerHTML={{ __html: openaiResponse }} // Render raw HTML content
          />
        </div>
      )}

      {/* Display error message if an error occurred */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Prompt Recommendations (conditionally render when response is not received) */}
      {!isResponseReceived && (
        <div className="prompt-recommendations">
          <h4>Suggested Prompts:</h4>
          <ul>
            <li>
              <p>"Can you provide details of government schemes related to agriculture for low-income farmers, including the scheme name, description, state, crop type, income level, eligibility, amount, application deadline, contact information, and website link? Please list at least 5 schemes."</p>
              <button onClick={() => handleCopyPrompt('Can you provide details of government schemes related to agriculture for low-income farmers, including the scheme name, description, state, crop type, income level, eligibility, amount, application deadline, contact information, and website link? Please list at least 5 schemes.')}>Copy</button>
            </li>
            <li>
              <p>"What are the latest government schemes available for farmers in India to promote sustainable farming practices?"</p>
              <button onClick={() => handleCopyPrompt('What are the latest government schemes available for farmers in India to promote sustainable farming practices?')}>Copy</button>
            </li>
            <li>
              <p>"Can you list government schemes that provide financial assistance to low-income farmers in India?"</p>
              <button onClick={() => handleCopyPrompt('Can you list government schemes that provide financial assistance to low-income farmers in India?')}>Copy</button>
            </li>
            <li>
              <p>"Provide details of government schemes aimed at increasing agricultural productivity in rural India."</p>
              <button onClick={() => handleCopyPrompt('Provide details of government schemes aimed at increasing agricultural productivity in rural India.')}>Copy</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AskOpenAI;
