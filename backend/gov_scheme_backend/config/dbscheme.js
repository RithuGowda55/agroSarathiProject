const mongoose = require("mongoose");

// Replace with your MongoDB Atlas connection string
const mongoURI =
  "mongodb+srv://druthigs2003:68KdK8ubdTu31uZl@cluster0.y8u9sgh.mongodb.net/scheme_agrosarathi";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
