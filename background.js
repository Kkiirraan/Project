// // Listen for messages from content scripts (optional)
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   // Handle messages from content scripts here
// });

// // Listen for web navigation completed event
// chrome.webNavigation.onCompleted.addListener(function(details) {
//   // Check if the navigation is from the main frame
//   if (details.frameId === 0) {
//     const url = details.url;
//     console.log("URL changed:", url);
//     sendDataToBackend(url);
//   }
// });

// // Function to send data to the backend server
// function sendDataToBackend(url) {
//   fetch('http://127.0.0.1:5000/receive_url', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ url: url })
//   })
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Failed to send data to backend: ' + response.statusText);
//     }
//     return response.json();
//   })
//   .then(data => {
//     console.log('Data sent to backend:', data);
//     if (data && data.message === "phishing") {
//       blockPageDeclarative(url);
//     } else {
//       console.error('Unexpected response from backend:', data.message);
//     }
//   })
//   .catch(error => {
//     console.error('Error:', error);
//     console.error('An error occurred while processing the request.');
//     // Handle error gracefully, e.g., show an alert to the user
//   });
// }

// // Function to block access to the page declaratively
// function blockPageDeclarative(url) {
//   chrome.declarativeNetRules.addRules([
//     {
//       conditions: [
//         new chrome.declarativeNet.RequestMatcher({ url: { urlMatches: url } })
//       ],
//       actions: [ new chrome.declarativeNet.CancelRequest() ]
//     }
//   ]);
// }
