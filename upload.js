document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("upload-form");
  const messageBox = document.getElementById("message-box");

  uploadForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(uploadForm);
    const image = formData.get("image");

    if (!image || image.size === 0) {
      alert("Please select a valid image.");
      return;
    }

    const username = localStorage.getItem("username");
    if (!username) {
      alert("You must be logged in to upload.");
      return;
    }

    formData.append("username", username);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      messageBox.style.display = "block";
      messageBox.innerText = result.message || "Image uploaded!";
      uploadForm.reset();
    } catch (err) {
      console.error("Upload failed", err);
      alert("Error uploading image.");
    }
  });
});
