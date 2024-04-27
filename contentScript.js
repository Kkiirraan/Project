// content.js

// Function to send URL to the backend for checking
let warningDisplayed = false; // Flag to track if warning has been displayed

function sendUrlForChecking(url) {
  // Make AJAX request or use Fetch API to send the URL to the backend
  const warningPageURL = 'http://127.0.0.1:5000/warning-page';
  // alert(warningPageURL)
  if (url === warningPageURL) {
    return; // Skip phishing checking for the warning page URL
  }
  fetch('http://127.0.0.1:5000/receive_url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: url })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to send URL to backend');
    }
    return response.json();
  })
  .then(data => {
    // Check response from the backend
    if (data && data.message === "phishing"  && url!=warningDisplayed ) {
      // Display a warning message to the user
      // alert("Warning: This page has been identified as phishing.");
      window.location.href = 'http://127.0.0.1:5000/warning-page';

      warningDisplayed = true;

    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// Get the current URL
const currentUrl = window.location.href;
// Send the URL to the backend for checking
sendUrlForChecking(currentUrl);
