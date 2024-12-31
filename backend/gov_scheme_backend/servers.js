// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const axios = require("axios");
// const nodemailer = require("nodemailer");
// const dbConnect = require("./dbConnect");
// const schemeRoutes = require("./routes/schemes");

// const app = express();

// // Connect to the database
// dbConnect();

// // Middleware
// app.use(express.json());
// app.use(cors({
//   origin: ['http://localhost:3001', 'http://localhost:8090', 'http://localhost:3000'],
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

// // Routes for the Scheme API
// app.use("/api", schemeRoutes);

// // OpenAI API route
// const openaiApiKey = process.env.OPENAI_API_KEY; // OpenAI API key from environment variables
// const azureEndpoint = process.env.AZURE_ENDPOINT || "https://aasare-new.openai.azure.com";
// const apiVersion = "2024-02-15-preview";

// app.post('/api/openai', async (req, res) => {
//   const questionText = req.body.question;

//   // Log request to check if it’s being hit
//   console.log("Received OpenAI request:", questionText);

//   if (!questionText) {
//     return res.status(400).json({ message: 'Question is required' });
//   }

//   const payload = {
//     model: "aasare-new",
//     messages: [
//       { role: "system", content: "You are a helpful assistant." },
//       { role: "user", content: questionText },
//     ],
//   };

//   try {
//     // Send request to Azure OpenAI API
//     const response = await axios.post(
//       `${azureEndpoint}/openai/deployments/aasare-35/chat/completions?api-version=${apiVersion}`,
//       payload,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "api-key": openaiApiKey,
//         },
//         timeout: 30000,  // 30 seconds timeout
//       }
//     );

//     const responseContent = response.data?.choices?.[0]?.message?.content;

//     if (!responseContent) {
//       throw new Error("Invalid response from Azure OpenAI");
//     }

//     console.log("Azure OpenAI response:", responseContent);

//     // Return the AI response
//     res.json({ response: responseContent });

//   } catch (error) {
//     console.error('Error contacting Azure OpenAI:', error.message);

//     if (error.response) {
//       res.status(error.response.status).json({ message: error.response.data || 'OpenAI API error' });
//     } else if (error.code === 'ECONNABORTED') {
//       res.status(504).json({ message: 'Connection timed out while reaching Azure OpenAI' });
//     } else {
//       res.status(500).json({ message: `Unexpected error: ${error.message}` });
//     }
//   }
// });

// // Contact API route
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'druthigs2003@gmail.com', // Your email
//     pass: 'zuic wtcu qatq zpqj', // Your email password (use app-specific password for Gmail)
//   },
// });

// app.post('/api/contact', (req, res) => {
//   const { name, email, subject, message } = req.body;

//   const mailOptions = {
//     from: email,
//     to: 'logisticsshipment958@gmail.com', // Admin email where you want to receive messages
//     subject: `New message from ${name} - ${subject}`,
//     text: `You have received a new message from ${name} (${email}):\n\n${message}`,
//   };

//   transporter.sendMail(mailOptions, (err, info) => {
//     if (err) {
//       console.error('Error occurred:', err); // Log the full error
//       return res.status(500).json({ success: false, message: "Error sending email", error: err });
//     } else {
//       console.log('Email sent: ' + info.response); // Log the response from the email
//       return res.status(200).json({ success: true, message: "Message sent successfully" });
//     }
//   });
// });

// // Root route
// app.get('/', (req, res) => {
//   res.send('Welcome to the Agro-Sarathi API!');
// });

// // Start the server
// const port = process.env.PORT || 8090;
// app.listen(port, () => {
//   console.log(`Listening on port ${port}...`);
// });

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const nodemailer = require("nodemailer");
const dbConnect = require("./dbConnect");
const schemeRoutes = require("./routes/schemes");
const subscribeRoutes = require("./routes/subscribe");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:8090",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());

// Connect to MongoDB (Scheme Database)
const mongoURI =
  process.env.MONGO_URI ||
  "mongodb+srv://druthigs2003:68KdK8ubdTu31uZl@cluster0.y8u9sgh.mongodb.net/scheme_agrosarathi";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Scheme database");
  })
  .catch((error) => {
    console.error("MongoDB Scheme database connection error:", error);
  });

// Connect to MongoDB (Newsletter Database)
const newsletterConnection = mongoose.createConnection(mongoURI, {
  dbName: "newsletter", // Different database name for the newsletter
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

newsletterConnection.on("connected", () => {
  console.log("Connected to Newsletter database");
});

newsletterConnection.on("error", (err) => {
  console.error("Newsletter database connection error:", err);
});

// Routes for the Scheme API
app.use("/api", schemeRoutes);

// Routes for the Subscribe API
app.use("/api", subscribeRoutes);

// OpenAI API route
const openaiApiKey = process.env.OPENAI_API_KEY;
const azureEndpoint =
  process.env.AZURE_ENDPOINT || "https://aasare-new.openai.azure.com";
const apiVersion = "2024-02-15-preview";

app.post("/api/openai", async (req, res) => {
  const questionText = req.body.question;

  if (!questionText) {
    return res.status(400).json({ message: "Question is required" });
  }

  const payload = {
    model: "aasare-new",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: questionText },
    ],
  };

  try {
    const response = await axios.post(
      `${azureEndpoint}/openai/deployments/aasare-35/chat/completions?api-version=${apiVersion}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": openaiApiKey,
        },
        timeout: 30000,
      }
    );

    const responseContent = response.data?.choices?.[0]?.message?.content;

    if (!responseContent) {
      throw new Error("Invalid response from Azure OpenAI");
    }

    res.json({ response: responseContent });
  } catch (error) {
    console.error("Error contacting Azure OpenAI:", error.message);

    if (error.response) {
      res
        .status(error.response.status)
        .json({ message: error.response.data || "OpenAI API error" });
    } else if (error.code === "ECONNABORTED") {
      res
        .status(504)
        .json({ message: "Connection timed out while reaching Azure OpenAI" });
    } else {
      res.status(500).json({ message: `Unexpected error: ${error.message}` });
    }
  }
});

// Contact API route
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "druthigs2003@gmail.com", // Your email
    pass: "zuic wtcu qatq zpqj", // Your email password (use app-specific password for Gmail)
  },
});

app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  const mailOptions = {
    from: email,
    to: "logisticsshipment958@gmail.com", // Admin email where you want to receive messages
    subject: `New message from ${name} - ${subject}`,
    text: `You have received a new message from ${name} (${email}):\n\n${message}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error occurred:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error sending email", error: err });
    } else {
      console.log("Email sent: " + info.response);
      return res
        .status(200)
        .json({ success: true, message: "Message sent successfully" });
    }
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Agro-Sarathi API!");
});

// Start the server
const port = process.env.PORT || 8090;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
