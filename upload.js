document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("upload-form");
  const messageBox = document.getElementById("message-box");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const url = document.getElementById("image-url").value.trim();

    if (!name || !url) {
      showMessage("Please fill in all fields.", false);
      return;
    }

    const imageData = { name, url, votes: 0 };
    backend.saveImage(imageData);
    showMessage("Image uploaded! Awaiting admin approval.", true);
    form.reset();
  });

  function showMessage(msg, success = true) {
    messageBox.textContent = msg;
    messageBox.style.display = "block";
    messageBox.style.backgroundColor = success ? "#d4edda" : "#f8d7da";
    messageBox.style.color = success ? "#155724" : "#721c24";
  }
});
