// Load environment variables from .env file
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios"); // Assuming you have a Scheme model for MongoDB

const app = express();
const PORT = process.env.PORT || 5000;
const openaiApiKey = process.env.OPENAI_API_KEY; // OpenAI API key from environment variables
const azureEndpoint =
  process.env.AZURE_ENDPOINT || "https://aasare-new.openai.azure.com"; // Azure endpoint from .env
const apiVersion = "2024-02-15-preview"; // Ensure correct API version

// Middleware
app.use(
  cors({
    // here if the project is running on other port just add them here to let the interdomain communication
    origin: [
      "http://localhost:3001",
      "http://localhost:5000",
      "http://localhost:3000",
    ], // Adjust based on your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json()); // Parse JSON payloads

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the Agro-Sarathi API!");
});

app.post("/api/openai", async (req, res) => {
  const questionText = req.body.question;

  // Check if questionText is provided
  if (!questionText) {
    return res.status(400).json({ message: "Question is required" });
  }

  const payload = {
    model: "aasare-new", // Ensure the correct model is used
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: questionText },
    ],
  };

  try {
    // Send request to Azure OpenAI API
    const response = await axios.post(
      `${azureEndpoint}/openai/deployments/aasare-35/chat/completions?api-version=${apiVersion}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": openaiApiKey, // Make sure this is in your .env file
        },
        timeout: 30000, // 30 seconds timeout
      }
    );

    const responseContent = response.data?.choices?.[0]?.message?.content;

    // Check if responseContent exists
    if (!responseContent) {
      throw new Error("Invalid response from Azure OpenAI");
    }

    console.log("Azure OpenAI response:", responseContent);

    // Return the AI response
    res.json({ response: responseContent });
  } catch (error) {
    console.error("Error contacting Azure OpenAI:", error.message);

    if (error.response) {
      // Handle errors from the OpenAI API
      res
        .status(error.response.status)
        .json({ message: error.response.data || "OpenAI API error" });
    } else if (error.code === "ECONNABORTED") {
      // Handle connection timeout errors
      res
        .status(504)
        .json({ message: "Connection timed out while reaching Azure OpenAI" });
    } else {
      // Handle other unexpected errors
      res.status(500).json({ message: `Unexpected error: ${error.message}` });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
