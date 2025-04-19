const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const Location = require('./models/Location'); // Import the Location model

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Use middleware
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/locationapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});




// Haversine formula to calculate distance between two points (lat, lon)
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }
  

// On a new client connection
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// POST request to store location data and notify nearby users
app.post('/api/location', async (req, res) => {
  try {
    const { loginId, name, latitude, longitude, duration } = req.body;

    // Create a new location entry
    const newLocation = new Location({ loginId, name, latitude, longitude, duration });
    await newLocation.save();

    console.log("Location saved:", req.body);

    // Notify nearby users via Socket.io
    io.emit('new-location', { loginId, name, latitude, longitude, duration });

    res.status(200).json({ message: 'Location saved and users notified' });
  } catch (err) {
    console.error("Error saving location:", err);
    res.status(500).json({ error: 'Error saving location' });
  }
});

// Start server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
