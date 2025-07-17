document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("upload-form");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    alert("Login required to upload.");
    window.location.href = "login.html";
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const fileInput = form.image.files[0];

    if (!fileInput || !name) {
      alert("Both fields required.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const images = JSON.parse(localStorage.getItem("images") || "[]");

      const now = Date.now();
      const uploads = JSON.parse(localStorage.getItem("uploadLogs") || "{}");
      const userUploads = uploads[currentUser.email] || [];

      const recentUploads = userUploads.filter(t => now - t < 24 * 60 * 60 * 1000);
      if (recentUploads.length >= 5) {
        alert("Upload limit reached (5 per 24 hours).");
        return;
      }

      const newImage = {
        name,
        data: reader.result,
        uploader: currentUser.email,
        approved: false
      };

      images.push(newImage);
      localStorage.setItem("images", JSON.stringify(images));

      uploads[currentUser.email] = [...recentUploads, now];
      localStorage.setItem("uploadLogs", JSON.stringify(uploads));

      alert("Uploaded! Awaiting admin approval.");
      form.reset();
    };

    reader.readAsDataURL(fileInput);
  });
});
