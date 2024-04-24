
 // Add event listener to capture "Enter" key press (or any desired trigger)
// Add event listener to capture "Enter" key press (or any desired trigger)
// document.addEventListener("keydown", function(event) {
//     if (event.key === "Enter" && chrome.runtime) { // Check if chrome.runtime exists
//       chrome.runtime.sendMessage({url: window.location.href});
//     }
//   });

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // Handle the message from the background script
  if (message && message.message !==null) {
      console.log('Message from background:', message.message);
      alert('Message from background:  ' + message.message);
      // Perform actions in the content script based on the message
  }
});
