const form = document.getElementById('upload-form');
const resultContainer = document.getElementById('result');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData();

  // Get the selected image directly
  const image = document.getElementById('image').files[0];
  document.getElementById('data').innerHTML = '';
  document.getElementById('data-title').innerHTML = '';
  document.getElementById('result').innerHTML = 'Please Wait For Respond.';
  console.log('Wait For Response');

  // Ensure the image is a valid Blob before appending to FormData
  if (image instanceof Blob) {
    formData.append('image', image, 'uploaded_image.jpeg');
    try {
      const response = await fetch('https://pre-traning-model-use.onrender.com/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      console.log('Response:', data); // Log the API response data to the console
      var labelValues = document.getElementById("data");
      data.forEach(function(item) {
      document.getElementById("data-title").innerHTML = "Detected Faces";
        var listItem = document.createElement("li");
        if (item.name) {
          let con = item.confidence.toString().substring(0, 4);
          listItem.textContent = item.name +' ('+ con +')';
          labelValues.appendChild(listItem);
        }
      });

      // Clear previous results
      resultContainer.innerHTML = '';

      // Display recognized faces with frames and labels
      if (data.length > 0) {
        // Create an Image object to get the actual image dimensions
        const img = new Image();
        img.onload = function() {
          // Display the recognized faces with frames and labels
          displayResult(data, img);
        };
        img.src = URL.createObjectURL(image);
      } else {
        // Display a message if no faces are recognized
        const noFacesMessage = document.createElement('p');
        noFacesMessage.textContent = 'No faces were recognized in the image.';
        resultContainer.appendChild(noFacesMessage);
        document.querySelector('p').style.color = 'red';
      }
    } catch (error) {
      displayError('An error occurred while processing the request.');
    }
  } else {
    displayError('Error uploading the image.');
  }
});

async function displayResult(data, image) {
  // Create a new canvas element
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');

  // Draw the image on the canvas
  ctx.drawImage(image, 0, 0);

  // Draw frames with labels around the recognized faces
  if (data.length > 0) {
    data.forEach((item) => {
      const { location, name } = item;
      const { top, right, bottom, left } = location;

      // Draw a green frame around the face
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 2;
      ctx.strokeRect(left, top, right - left, bottom - top);

      // Draw the label on the frame
      ctx.fillStyle = 'green';
      ctx.font = '16px Arial';
      ctx.fillText(name, left, top - 5); // Adjust the position as needed
    });
  }

  // Append the canvas to the result container
  resultContainer.innerHTML = '';
  resultContainer.appendChild(canvas);
}

function displayError(errorMessage) {
  // Display error message in the result container
  resultContainer.innerHTML = `<p>Error: ${errorMessage}</p>`;
}
