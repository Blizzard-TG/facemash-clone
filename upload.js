document.getElementById("upload-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const fileInput = document.getElementById("image-file");
  const messageBox = document.getElementById("message-box");

  if (!fileInput.files.length) {
    return showMessage("Please select an image file to upload.");
  }

  const file = fileInput.files[0];

  // Validate image type
  if (!file.type.startsWith("image/")) {
    return showMessage("Only image files are allowed.");
  }

  // Read file as Base64
  const reader = new FileReader();
  reader.onload = function () {
    const base64Image = reader.result;

    // Create image object
    const imageEntry = {
      id: Date.now(),
      name,
      image: base64Image,
      score: 0,
      uploadedAt: new Date().toISOString(),
      approved: false // Admin needs to approve
    };

    // Store in localStorage
    const uploads = JSON.parse(localStorage.getItem("uploadedImages") || "[]");
    uploads.push(imageEntry);
    localStorage.setItem("uploadedImages", JSON.stringify(uploads));

    showMessage("Image uploaded successfully! Waiting for admin approval.");

    // Reset form
    fileInput.value = "";
    document.getElementById("name").value = "";
  };

  reader.readAsDataURL(file);
});

function showMessage(msg) {
  const messageBox = document.getElementById("message-box");
  messageBox.textContent = msg;
  messageBox.style.display = "block";
}
