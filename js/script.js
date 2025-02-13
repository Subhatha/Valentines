var size = 1.2;
var noBtn = document.getElementById("no");
var yesBtn = document.getElementById("yes");

var messages = [
  "Are you sure?",
  "Really Sure?",
  "Are you positive??",
  "Honey please",
  "Just think about it",
  "If you say no, I'll be sad",
  "I'll be very sad",
  "I'll be very very very sad",
  "You're breaking my heart :(",
  "ok fine",
  "Nah",
];

var messageIndex = 0;

// Function to resize buttons
function resize() {
  var font = window
    .getComputedStyle(yesBtn, null)
    .getPropertyValue("font-size");
  var padding = window
    .getComputedStyle(yesBtn, null)
    .getPropertyValue("padding");

  var fontSize = parseInt(font.split("px"));
  var left = parseInt(padding.split("px")[0]);
  var right = parseInt(padding.split("px")[1]);

  var newFont = fontSize * size;
  var l1 = left * size;
  var l2 = right * size;

  if (messageIndex < messages.length - 1) {
    yesBtn.style.fontSize = newFont + "px";
    yesBtn.style.padding = l1 + "px " + l2 + "px";
    noBtn.style.fontSize = "16px";
  } else {
    document.querySelector(".question").style.display = "none"; 
    yesBtn.style.transition = "all 0.5s ease";
    yesBtn.style.fontSize = "100px"; 
    yesBtn.style.padding = "20px 60px"; 

    yesBtn.style.position = "absolute"; 
    yesBtn.style.top = "0"; 
    yesBtn.style.left = "0"; 
    yesBtn.style.width = "100vw"; 
    yesBtn.style.height = "100vh"; 
    yesBtn.style.fontSize = "10vw"; 
    yesBtn.style.display = "flex"; 
    yesBtn.style.justifyContent = "center";  
    yesBtn.style.alignItems = "center"; 
    yesBtn.style.zIndex = "9999";

    noBtn.style.display = "none"; 
  }
}

// Function to cycle through the "No" button messages
function message() {
  if (messageIndex < messages.length) {
    var currentMessage = messages[messageIndex];
    noBtn.innerHTML = currentMessage;
    messageIndex++;
  } else {
    noBtn.innerHTML = messages[0];
  }
}

// Function for "No" button click
function noPress() {
  resize();
  message();
}

function submitAnswer(answer) {
  const data = { answer: answer };
  console.log('Sending data:', data);

  return fetch('https://script.google.com/macros/s/AKfycbyvywU4l2p-1425-qPVi_j0eT9aUpOEcW5SUs5Qd5ePcPIbKZyTOhSq3pqk3IJqU7xZgA/exec', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(result => {
    console.log('Google Script Response:', result);  // Log the full response from Google Apps Script
    if(result.result === "success") {
      console.log("Data saved successfully!");
    } else {
      console.error("Failed to save data:", result.message);
      sendErrorToSheet(result.message); // Send error to Google Sheets if something went wrong
    }
  })
  .catch(error => {
    console.error('Error:', error);
    sendErrorToSheet(error.message); // Log error to Google Sheets as well
  });
}

// Function to send errors to Google Sheets
function sendErrorToSheet(errorMessage) {
  const errorData = { error: errorMessage };
  fetch('https://script.google.com/macros/s/AKfycbyvywU4l2p-1425-qPVi_j0eT9aUpOEcW5SUs5Qd5ePcPIbKZyTOhSq3pqk3IJqU7xZgA/exec', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(errorData),
  })
  .then(response => response.json())
  .then(result => {
    console.log('Error logged to sheet:', result);
  })
  .catch(error => {
    console.error('Error logging error to sheet:', error);
  });
}


// Function for "Yes" button click
function yesPress() {
  console.log('Yes button clicked!');

  submitAnswer('Yes')
    .then(() => {
      window.location.href = 'pages/yes.html'; // Redirect after submission
    })
    .catch(error => {
      console.error('Error while submitting answer:', error);
    });
}

// Adding event listeners to the buttons
document.getElementById('yes').addEventListener('click', yesPress);
document.getElementById('no').addEventListener('click', noPress);
