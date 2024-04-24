// Listen for messages from content scripts
chrome.webNavigation.onCompleted.addListener(function(details) {
  // Check if the navigation is from the main frame
  if (details.frameId === 0) {
      // Extract the URL from the details object
      var url = details.url;
      // Process the URL as needed
      console.log("URL changed:", url);
      // Send the URL to your backend server
      sendDataToBackend(url);
  }
});
  console.log("From the background");
  
  // Function to send data to your backend server
  function sendDataToBackend(url) {
    // Make AJAX request or use Fetch API to send data to your backend
    fetch('http://127.0.0.1:5000/receive_url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({url: url})
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to send data to backend');
      }
      return response.json();
    })
    .then(data => {
      console.log('Data sent to backend:', data);
      if (data && data.message !== null) {
        // Handle success here
        console.log('URL received successfully');
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { message: data.message });
      });
      } else {
        // Handle other responses if needed
        console.error('Unexpected response from backend:', data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  
  
  

