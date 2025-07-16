//! admin.js

document.addEventListener("DOMContentLoaded", () => {
  const images = JSON.parse(localStorage.getItem("images") || "[]");
  const pending = images.filter(img => !img.approved);
  const container = document.getElementById("admin-approval");

  if (pending.length === 0) {
    container.innerHTML = "<p>No pending images for approval.</p>";
    return;
  }

  pending.forEach((img, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${img.data}" alt="${img.name}" style="max-width: 100%;">
      <p><strong>${img.name}</strong></p>
      <button data-index="${index}">Approve</button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      img.approved = true;
      localStorage.setItem("images", JSON.stringify(images));
      location.reload();
    });
    container.appendChild(card);
  });
});
