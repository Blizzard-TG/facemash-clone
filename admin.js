function renderAdminTools(img, index, images) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${img.data}" alt="${img.name}" style="max-width: 100%;">
    <p><strong>${img.name}</strong></p>
    <button class="approve-btn" data-index="${index}">Approve</button>
    <button class="edit-btn" data-index="${index}">Edit</button>
    <button class="delete-btn" data-index="${index}">Delete</button>
  `;

  card.querySelector(".approve-btn").addEventListener("click", () => {
    img.approved = true;
    localStorage.setItem("images", JSON.stringify(images));
    location.reload();
  });

  card.querySelector(".edit-btn").addEventListener("click", () => {
    const newName = prompt("Edit name:", img.name);
    if (newName) {
      img.name = newName;
      localStorage.setItem("images", JSON.stringify(images));
      location.reload();
    }
  });

  card.querySelector(".delete-btn").addEventListener("click", () => {
    if (confirm("Delete this image?")) {
      images.splice(index, 1);
      localStorage.setItem("images", JSON.stringify(images));
      location.reload();
    }
  });

  return card;
}

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  if (!currentUser || currentUser.role !== "admin") {
    alert("Admins only.");
    window.location.href = "login.html";
    return;
  }

  const images = JSON.parse(localStorage.getItem("images") || "[]");
  const pending = images.filter(img => !img.approved);
  const container = document.getElementById("admin-approval");

  if (pending.length === 0) {
    container.innerHTML = "<p>No pending images for approval.</p>";
    return;
  }

  pending.forEach((img, index) => {
    container.appendChild(renderAdminTools(img, index, images));
  });

  // Export/Import
  const exportBtn = document.getElementById("export-data");
  const importInput = document.getElementById("import-data");

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const exportData = {
        images: JSON.parse(localStorage.getItem("images") || "[]"),
        votes: JSON.parse(localStorage.getItem("votes") || "{}")
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "facemash-data.json";
      a.click();
    });
  }

  if (importInput) {
    importInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          if (importedData.images) localStorage.setItem("images", JSON.stringify(importedData.images));
          if (importedData.votes) localStorage.setItem("votes", JSON.stringify(importedData.votes));
          alert("Data imported successfully.");
          location.reload();
        } catch (err) {
          alert("Invalid JSON file.");
        }
      };
      reader.readAsText(file);
    });
  }
});
