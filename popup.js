
// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Your jQuery-dependent code here
  $(document).ready(function() {
    // Event listener for button click
    $('#button').click(function(event) {
      // Prevent default form submission behavior
      event.preventDefault();

      // Retrieve URL input value
      var url = $('#text').val();

      // Check if URL is empty
      if (!url) {
        alert('Please enter a URL');
        return;
      }

      // Prepare JSON data
      var jsonData = JSON.stringify({ 'url': url });

      // Send AJAX POST request to backend
      $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:5000/check_url',
        contentType: 'application/json',
        data: jsonData,
        success: function(response) {
          console.log(response);
          const detectedMessage = response.detected_message.detected_message;
          const domainData = response.domain_data;
          // update the page with the detected message
          document.getElementById('all').style.display = 'none';
          document.getElementById('welcome').style.display = 'none';
          document.getElementById('welcome-p').style.display = 'none';
           // Hide all <p> tags
          //  const allPTags = document.querySelectorAll('p');
          //  allPTags.forEach(p => {
          //      p.style.display = 'none';
          //  });
          // document.getElementById('detected-message').innerText = detectedMessage;
          alert(response.detected_message.detected_message);
        }, 
        error: function(response) {
          // Handle error response from backend
          console.log(response);
        }
      });
    });
  });
});
