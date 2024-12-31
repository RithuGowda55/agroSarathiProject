const mongoose = require("mongoose"); // Ensure mongoose is imported

const schemeSchema = new mongoose.Schema({
  schemeName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  cropType: {
    type: String,
    required: true,
  },
  incomeLevel: {
    type: String,
    required: true,
  },
  eligibility: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  applicationDeadline: {
    type: Date,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(v); // Valid URL format check
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
});

// Make sure you are passing the schema correctly
const Scheme = mongoose.model("Scheme", schemeSchema);

module.exports = Scheme;
