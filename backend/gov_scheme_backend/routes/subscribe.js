const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber"); // Subscriber model

// POST route to handle subscription
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Check if the email already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(409).json({ message: "Email already subscribed" });
    }

    // Save the new subscriber
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    res.status(201).json({ message: "Subscription successful" });
  } catch (error) {
    console.error("Error saving subscriber:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
