function getLocation() {
    const loginId = document.getElementById('loginId').value.trim();
    const name = document.getElementById('name').value.trim();
  
    if (!loginId || !name) {
      alert("Please enter your login ID and name.");
      return;
    }
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
  
        const userData = {
          loginId,
          name,
          latitude,
          longitude
        };
  
        await fetch('/api/location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
  
        alert("Location shared successfully!");
      }, error => {
        alert("Location access denied.");
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }

  
  const socket = io('http://localhost:3000');

// Listen for new location notifications
socket.on('new-location', (location) => {
  console.log('New location nearby:', location);

  // Display a notification to the user
  // You can create a modal or notification UI to show this
  if (confirm(`${location.name} is nearby. Do you accept the request?`)) {
    // If user clicks 'Accept', open the chatbox
    openChatBox(location);
  } else {
    console.log('User rejected the location request.');
  }
});

// Function to open the chatbox
function openChatBox(location) {
  console.log('Opening chatbox with:', location.name);
  // Implement your chatbox opening functionality here
}
