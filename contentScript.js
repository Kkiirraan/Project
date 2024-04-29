// content.js

// Function to send URL to the backend for checking
let warningDisplayed = false; // Flag to track if warning has been displayed
let phishingDisplayed = false; // Flag to track if
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
    if(data.block_url!=true) {
    if (data && data.message === "phishing" && url != warningDisplayed) {
      // Define the function to create the phishing warning message
      function createPhishingWarning() {
          // Create a custom alert message container
          var alertMessage = document.createElement('div');
          alertMessage.style.position = 'fixed';
          // alertMessage.style.height = '50px';
          alertMessage.style.top = '20px';
          alertMessage.style.left = '40%';
          alertMessage.style.padding = '50px';
          alertMessage.style.backgroundColor = '#ff0800';
          alertMessage.style.border = '1px solid #ff0000';
          alertMessage.style.zIndex = '9999';
  
          // Create a close icon
          var closeIcon = document.createElement('span');
          closeIcon.innerHTML = '&times;';
          closeIcon.style.position = 'absolute';
          closeIcon.style.top = '0';
          closeIcon.style.right = '5px';
          closeIcon.style.cursor = 'pointer';
          closeIcon.style.fontSize = '24px';
          closeIcon.onclick = function() {
              alertMessage.style.display = 'none';
          };
          alertMessage.appendChild(closeIcon);
  
          // Create proceed button
          var proceedButton = document.createElement('button');
          proceedButton.innerText = 'Proceed';
          proceedButton.style.backgroundColor = '#ff0800';
          proceedButton.style.color = 'white';
          proceedButton.style.padding = '10px 20px';
          proceedButton.style.marginRight = '10px';
          proceedButton.style.marginTop = '30px';
          proceedButton.style.position = 'absolute';
          proceedButton.style.border = 'none';
          proceedButton.style.cursor = 'pointer';
          proceedButton.onclick = function() {
              // Implement your logic for proceeding here
              alertMessage.style.display = 'none';
          };
          alertMessage.appendChild(proceedButton);
  
          // Create exit button
          // Create exit button
            var exitButton = document.createElement('button');
            exitButton.innerText = 'Exit';
            exitButton.style.backgroundColor = 'white';
            exitButton.style.color = 'green';
            exitButton.style.padding = '10px 20px';
            exitButton.style.marginRight = '40px';
            exitButton.style.marginTop = '30px';
            exitButton.style.position = 'absolute';
            exitButton.style.marginLeft = '150px';
            exitButton.style.border = 'none';
            exitButton.style.cursor = 'pointer';
            exitButton.style.borderRadius='5px';
            exitButton.onclick = function() {
                // Redirect to the previous URL
                window.history.back();
            };
            alertMessage.appendChild(exitButton);

          // Add text to the alert message
          var alertText = document.createElement('span');
          alertText.innerText = 'Warning: This website may be phishing. Proceed with caution.';
          alertText.style.fontSize = '13px';
          alertText.style.color = 'white';
          alertMessage.appendChild(alertText);
  
          // Create the check icon element
          var checkIcon = document.createElement('i');
          checkIcon.className = 'fa fa-info-circle spin'; // Set the class for the Font Awesome icon
          checkIcon.style.position = 'absolute';
          checkIcon.style.top = '45px';
          checkIcon.style.left = '20px';
          checkIcon.style.fontSize = '24px';
          checkIcon.style.color = 'white'; // Set the initial color of the icon
  
          // Append the icon to the alert message
          alertMessage.appendChild(checkIcon);
  
          // Define the animation for the color change
         // Define the animation for the color change
      var colorAnimation = document.createElement('style');
      colorAnimation.textContent = `
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      .spin {
        animation: spin 2s linear infinite;
      }
      `;

      // Append the animation style to the document head
      document.head.appendChild(colorAnimation);

          var fontAwesomeLink = document.createElement('link');
          fontAwesomeLink.rel = 'stylesheet';
          fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'; // URL for Font Awesome CSS file
          document.head.appendChild(fontAwesomeLink);
          // Add the custom alert message to the webpage
          document.body.appendChild(alertMessage);
      }
  
      // Call the function to create the phishing warning message
      createPhishingWarning();
  
      // Set warningDisplayed flag to true
      warningDisplayed = true;
  }
  
  if (data && data.message === "malware" && url != warningDisplayed) {
          // window.location.href = 'http://127.0.0.1:5000/warning-page';
          function createPhishingWarning() {
            // Create a custom alert message container
            var alertMessage = document.createElement('div');
            alertMessage.style.position = 'fixed';
            alertMessage.style.top = '20px';
            alertMessage.style.left = '40%';
            alertMessage.style.padding = '50px';
            // alertMessage.style.margin='20px';
            alertMessage.style.backgroundColor = '#000e36';
            alertMessage.style.border = '1px solid #000e36';
            alertMessage.style.zIndex = '9999';
        
            // Create a close icon
            var closeIcon = document.createElement('span');
            closeIcon.innerHTML = '&times;';
            closeIcon.style.position = 'absolute';
            closeIcon.style.top = '0';
            closeIcon.style.right = '5px';
            closeIcon.style.cursor = 'pointer';
            closeIcon.style.fontSize = '24px';
            closeIcon.onclick = function() {
                alertMessage.style.display = 'none';
            };
            alertMessage.appendChild(closeIcon);
        
            // Create proceed button
            var proceedButton = document.createElement('button');
            proceedButton.innerText = 'Proceed';
            proceedButton.style.backgroundColor = '#000e36';
            proceedButton.style.color = 'white';
            proceedButton.style.padding = '10px 20px';
            proceedButton.style.marginRight = '10px';
            proceedButton.style.marginTop = '30px';
            proceedButton.style.marginBottom = '30px';
            proceedButton.style.position = 'absolute';
            proceedButton.style.border = 'none';
            proceedButton.style.cursor = 'pointer';
            proceedButton.onclick = function() {
                // Implement your logic for proceeding here
                alertMessage.style.display = 'none';
            };
            alertMessage.appendChild(proceedButton);
        
            // Create exit button
            // Create exit button
              var exitButton = document.createElement('button');
              exitButton.innerText = 'Exit';
              exitButton.style.backgroundColor = 'white';
              exitButton.style.color = 'green';
              exitButton.style.padding = '10px 20px';
              exitButton.style.marginRight = '40px';
              exitButton.style.marginTop = '30px';
              exitButton.style.position = 'absolute';
              exitButton.style.marginLeft = '150px';
              exitButton.style.marginBottom = '30px';
              exitButton.style.border = 'none';
              exitButton.style.cursor = 'pointer';
              exitButton.style.borderRadius='5px';
              exitButton.onclick = function() {
                  // Redirect to the previous URL
                  window.history.back();
              };
              alertMessage.appendChild(exitButton);
        
            // Add text to the alert message
            var alertText = document.createElement('span');
            alertText.innerText = 'Warning: This website has Malware. Proceed with caution.';
            alertText.style.fontSize = '13px';
            alertText.style.color = 'white';
            alertMessage.appendChild(alertText);
        
            // Create the check icon element
            var checkIcon = document.createElement('i');
            checkIcon.className = 'far fa-times-circle shine'; // Set the class for the Font Awesome icon
            checkIcon.style.position = 'absolute';
            checkIcon.style.top = '45px';
            checkIcon.style.left = '20px';
            checkIcon.style.fontSize = '24px';
            checkIcon.style.color = 'white'; // Set the initial color of the icon
        
            // Append the icon to the alert message
            alertMessage.appendChild(checkIcon);
        
            // Define the animation for the color change
           // Define the animation for the color change
              var colorAnimation = document.createElement('style');
              colorAnimation.textContent = `
             
              @keyframes shine {
                0% {
                 color: #2B3246;
                }
                50% {
                  text-shadow:
                    0 0 5px #fff,
                    0 0 10px #fff,
                    0 0 40px red,
                    0 0 60px red,
                    0 0 80px red;
                }
              }
              .shine {
                animation: shine 2s linear infinite;
              }
              `;
        
              // Append the animation style to the document head
              document.head.appendChild(colorAnimation);
        
                  var fontAwesomeLink = document.createElement('link');
                  fontAwesomeLink.rel = 'stylesheet';
                  fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'; // URL for Font Awesome CSS file
                  document.head.appendChild(fontAwesomeLink);
                  // Add the custom alert message to the webpage
                  document.body.appendChild(alertMessage);
              }
        
              // Call the function to create the phishing warning message
              createPhishingWarning();
        
              // Set warningDisplayed flag to true
              warningDisplayed = true;
  }
  if (data && data.message === "benign" && url != warningDisplayed) {
    function createPhishingWarning() {
      // Create a custom alert message container
      var alertMessage = document.createElement('div');
      alertMessage.style.position = 'fixed';
      alertMessage.style.top = '20px';
      alertMessage.style.left = '40%';
      alertMessage.style.padding = '50px';
      alertMessage.style.backgroundColor = '#026d00';
      alertMessage.style.border = '1px solid rgba(147, 209, 117, 0.50)';
      alertMessage.style.zIndex = '9999';
      
      // Create a close icon
      var closeIcon = document.createElement('span');
      closeIcon.innerHTML = '&times;';
      closeIcon.style.position = 'absolute';
      closeIcon.style.top = '0';
      closeIcon.style.right = '5px';
      closeIcon.style.cursor = 'pointer';
      closeIcon.style.fontSize = '24px';
      closeIcon.onclick = function() {
          alertMessage.style.display = 'none';
      };
      // Create a tick mark icon
    // Create a check circle icon element
            // Create the check icon element
      var checkIcon = document.createElement('i');
      checkIcon.className = 'far fa-check-circle color'; // Set the class for the Font Awesome icon
      checkIcon.style.position = 'absolute';
      checkIcon.style.top = '45px';
      checkIcon.style.left = '20px';
      checkIcon.style.fontSize = '24px';
      checkIcon.style.color = 'white'; // Set the initial color of the icon

      // Define the animation for the color change
      var colorAnimation = document.createElement('style');
      colorAnimation.textContent = `
      @keyframes color {
        50% {
          color: #2B3246; /* Change to the desired color */
        }
        100% {
          color: #0ad406; /* Change to the desired color */
        }
      }
      /* Apply the animation to the icon */
      .color {
        animation: color 2s linear infinite;
      }
      `;

      // Append the animation style to the document head
      document.head.appendChild(colorAnimation);

      // Append the icon to the alert message
      alertMessage.appendChild(checkIcon);

      // Create a link element for Font Awesome CSS
      var fontAwesomeLink = document.createElement('link');
      fontAwesomeLink.rel = 'stylesheet';
      fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'; // URL for Font Awesome CSS file
      document.head.appendChild(fontAwesomeLink);

      alertMessage.appendChild(closeIcon);

      
      // Add text to the alert message
      var alertText = document.createElement('span');
      alertText.innerText = 'This website is detected as Safe.';
      alertText.style.fontSize = '13px';
      alertText.style.color = 'white';
      alertMessage.appendChild(alertText);
      
      // Add the custom alert message to the webpage
      document.body.appendChild(alertMessage);
  }
  createPhishingWarning();


}
if (data && data.message === "defacement" && url != warningDisplayed) {
  function createPhishingWarning() {
    // Create a custom alert message container
    var alertMessage = document.createElement('div');
    alertMessage.style.position = 'fixed';
    // alertMessage.style.height = '50px';
    alertMessage.style.top = '20px';
    alertMessage.style.left = '40%';
    alertMessage.style.padding = '50px';
    alertMessage.style.backgroundColor = 'rgb(255, 111, 0)';
    alertMessage.style.border = '1px solid #ff0000';
    alertMessage.style.zIndex = '9999';

    // Create a close icon
    var closeIcon = document.createElement('span');
    closeIcon.innerHTML = '&times;';
    closeIcon.style.position = 'absolute';
    closeIcon.style.top = '0';
    closeIcon.style.right = '5px';
    closeIcon.style.cursor = 'pointer';
    closeIcon.style.fontSize = '24px';
    closeIcon.onclick = function() {
        alertMessage.style.display = 'none';
    };
    alertMessage.appendChild(closeIcon);

    // Create proceed button
    var proceedButton = document.createElement('button');
    proceedButton.innerText = 'Proceed';
    proceedButton.style.backgroundColor = 'rgb(255, 111, 0)';
    proceedButton.style.color = 'white';
    proceedButton.style.padding = '10px 20px';
    proceedButton.style.marginRight = '10px';
    proceedButton.style.marginTop = '30px';
    proceedButton.style.position = 'absolute';
    proceedButton.style.border = 'none';
    proceedButton.style.cursor = 'pointer';
    proceedButton.onclick = function() {
        // Implement your logic for proceeding here
        alertMessage.style.display = 'none';
    };
    alertMessage.appendChild(proceedButton);

    // Create exit button
    // Create exit button
      var exitButton = document.createElement('button');
      exitButton.innerText = 'Exit';
      exitButton.style.backgroundColor = 'white';
      exitButton.style.color = 'green';
      exitButton.style.padding = '10px 20px';
      exitButton.style.marginRight = '40px';
      exitButton.style.marginTop = '30px';
      exitButton.style.position = 'absolute';
      exitButton.style.marginLeft = '150px';
      exitButton.style.border = 'none';
      exitButton.style.cursor = 'pointer';
      exitButton.style.borderRadius='5px';
      exitButton.onclick = function() {
          // Redirect to the previous URL
          window.history.back();
      };
      alertMessage.appendChild(exitButton);

    // Add text to the alert message
    var alertText = document.createElement('span');
    alertText.innerText = 'Warning: This website may defaced. Proceed with caution.';
    alertText.style.fontSize = '13px';
    alertText.style.color = 'white';
    alertMessage.appendChild(alertText);

    // Create the check icon element
    var checkIcon = document.createElement('i');
    checkIcon.className = 'fa fa-exclamation-triangle rotate'; // Set the class for the Font Awesome icon
    checkIcon.style.position = 'absolute';
    checkIcon.style.top = '45px';
    checkIcon.style.left = '20px';
    checkIcon.style.fontSize = '24px';
    checkIcon.style.color = 'white'; // Set the initial color of the icon

    // Append the icon to the alert message
    alertMessage.appendChild(checkIcon);

    // Define the animation for the color change
   // Define the animation for the color change
      var colorAnimation = document.createElement('style');
      colorAnimation.textContent = `
      @keyframes rotate {
        0% {
           transform: rotate(0deg);
         }
         20% {
           transform: rotate(90deg);
         }
         40% {
           transform: rotate(0deg);
         }
         80% {
           transform: rotate(-90deg);
         }
       }
       .rotate {
        animation: rotate 2s linear infinite;
      }
      `;

      // Append the animation style to the document head
      document.head.appendChild(colorAnimation);

          var fontAwesomeLink = document.createElement('link');
          fontAwesomeLink.rel = 'stylesheet';
          fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'; // URL for Font Awesome CSS file
          document.head.appendChild(fontAwesomeLink);
          // Add the custom alert message to the webpage
          document.body.appendChild(alertMessage);
      }

      // Call the function to create the phishing warning message
      createPhishingWarning();

      // Set warningDisplayed flag to true
      warningDisplayed = true;

      }}
      else{
                  window.location.href = 'http://127.0.0.1:5000/warning-page';

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



