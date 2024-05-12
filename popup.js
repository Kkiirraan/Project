
// Wait for the document to be fully loaded
var url;
document.addEventListener('DOMContentLoaded', function() {
  // Your jQuery-dependent code here
  $(document).ready(function() {
    // Event listener for button click
    $('#button').click(function(event) {
      // Prevent default form submission behavior
      event.preventDefault();

      // Retrieve URL input value
       url = $('#text').val();

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
          const blockedTrue=response.blockedTrue;
          // alert(blockedTrue);
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
          // "phishing', 'benign', 'defacement', 'malware"
          document.getElementById('detected-message').innerText = detectedMessage || "Unable to detect the url";
          if (detectedMessage === 1){
          document.getElementById('safety').innerText = "This URL has been identified as phishing. Proceed with caution.";
          document.getElementById('set-content').innerText = " This website has been flagged as potentially dangerous. Phishing websites often impersonate legitimate ones in order to steal sensitive information such as login credentials, credit card numbers, or personal details. Exercise caution and avoid entering any personal information on this site. It's recommended to close this page and refrain from interacting with it further to protect your online security.";
          document.getElementById('after-phishing').style.display = 'block';
          if(blockedTrue===true){
            $('#blockPhishing').text('UnBlock');
 
          }

          }else if (detectedMessage === 0){
            document.getElementById('safety').innerText = "This URL is safe to use.";
            document.getElementById('set-content').innerText = " This website has been determined to be benign, meaning it poses no immediate threat to your online security. Benign websites are considered safe to browse and interact with. However, it's always a good practice to exercise caution and verify the legitimacy of the content and links before sharing any personal information or downloading files. Enjoy exploring this website knowing that it has been deemed safe for browsing.";

            document.getElementById('after-benign').style.display = 'block';

          }else{
            document.getElementById('safety').innerText = "This URL has been identified as malware. never proceed.";
            document.getElementById('set-content').innerText = "This website has been identified as hosting malware, which can pose serious risks to your device and personal data. Malware, short for malicious software, includes viruses, trojans, and other harmful programs designed to steal information, damage files, or gain unauthorized access to your system. Visiting or interacting with this website may result in malware being downloaded to your device without your knowledge. It's strongly advised to refrain from accessing this site and to run a thorough antivirus scan on your device to ensure your online safety ";

            document.getElementById('after-malware').style.display = 'block';
            if(blockedTrue===true){
              $('#blockMalware').text('UnBlock');
   
            }

          }
          document.getElementById('response-container').style.display = 'block';
          const nameServersArray=response.domain_data.name_servers;
          let message = " ";
                       nameServersArray.forEach(server => {
             message += server + "\n";
             });
             document.getElementById('name_server').innerText = message;
             const domainName=response.domain_data.domain_name;
             let domain = " ";
                          domainName.forEach(server => {
                domain+= server + "\n";
                });
                document.getElementById('name_server').innerText = message;

          document.getElementById('domain_name').innerText = domain || "Not available";
          document.getElementById('created').innerText = response.domain_data.creation_date || "Not available";
          document.getElementById('expiry').innerText = response.domain_data.expiration_date[0] || "Not available";
          document.getElementById('state').innerText = response.domain_data.state || "Not available";
          document.getElementById('register').innerText = response.domain_data.registrar || "Not available";
          document.getElementById('org_name').innerText = response.domain_data.org || "Not available";
          document.getElementById('country').innerText = response.domain_data.country || "Not available";
          // alert(response.detected_message.detected_message);
        }, 
        error: function(response) {
          // Handle error response from backend
          console.log(response);
        }
      });
    });
  });
});

$(document).ready(function() {
$('#blockMalware').click(function(e) {
  e.preventDefault();
const jsonData = JSON.stringify({ url: url });
  // alert(url);
// Send AJAX request to the backend
$.ajax({
  type: 'POST',
  url: 'http://127.0.0.1:5000/block_url', // Replace with your backend URL
  contentType: 'application/json',
  data: jsonData,
  success: function(response) {
    // Handle successful response from the backend
    console.log(response);
    // alert(response.success);
    if (response.success==='Sblock'){
      $('#blockMalware').text('Block');
    // Disable the button
    }
    if (response.success==='Ablock'){
      $('#blockMalware').text('Block');
    // Disable the button
    }
  },
  error: function(xhr, status, error) {
    // Handle error response from the backend
    console.error('Error sending URL to the backend:', error);
  }
});
});
});


$(document).ready(function() {
  $('#blockDefacement').click(function(e) {
    e.preventDefault();
    var buttonText = $(this).text();
    // alert(buttonText);
    const jsonData = JSON.stringify({ url: url ,buttonText: buttonText});
  // Send AJAX request to the backend
  $.ajax({
    type: 'POST',
    url: 'http://127.0.0.1:5000/block_url', // Replace with your backend URL
    contentType: 'application/json',
    data: jsonData,
    success: function(response) {
      // Handle successful response from the backend
      console.log(response);
      // alert(response.success);
      if (response.success==='Sblock'){
        $('#blockDefacement').text('UnBlock');
      // Disable the button
      }
      if (response.success==='Ablock'){
        $('#blockDefacement').text('Block');
      // Disable the button
      }
    },
    error: function(xhr, status, error) {
      // Handle error response from the backend
      console.error('Error sending URL to the backend:', error);
    }
  });
  });
  });


  $(document).ready(function() {
    $('#blockPhishing').click(function(e) {
      e.preventDefault();
    const jsonData = JSON.stringify({ url: url });
      // alert(url);
    // Send AJAX request to the backend
    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1:5000/block_url', // Replace with your backend URL
      contentType: 'application/json',
      data: jsonData,
      success: function(response) {
        // Handle successful response from the backend
        console.log(response);
        // alert(response.success);
        if (response.success==='Sblock'){
          $('#blockPhishing').text('UnBlock');
        // Disable the button
        }
        if (response.success==='Ablock'){
          $('#blockPhishing').text('Block');
        // Disable the button
        }
      },
      error: function(xhr, status, error) {
        // Handle error response from the backend
        console.error('Error sending URL to the backend:', error);
      }
    });
    });
    });