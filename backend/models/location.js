// backend/models/Location.js

const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  loginId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true  // how long they want to share location (in minutes maybe)
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Location', locationSchema);
