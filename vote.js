document.addEventListener("DOMContentLoaded", () => {
  const voteBox = document.querySelector(".vote-box");

  const fetchVoteImages = async () => {
    try {
      const res = await fetch("/api/vote-images");
      const data = await res.json();
      if (data.images && data.images.length === 2) {
        renderImages(data.images);
      } else {
        voteBox.innerHTML = "<p>Not enough images to vote on.</p>";
      }
    } catch (err) {
      console.error("Failed to fetch vote images", err);
    }
  };

  const renderImages = ([img1, img2]) => {
    voteBox.innerHTML = `
      <img src="${img1.url}" class="vote-img" data-id="${img1.id}">
      <img src="${img2.url}" class="vote-img" data-id="${img2.id}">
    `;

    document.querySelectorAll(".vote-img").forEach((img) => {
      img.addEventListener("click", async () => {
        const winner = img.dataset.id;
        const loser = winner === img1.id ? img2.id : img1.id;

        try {
          await fetch("/api/vote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ winner, loser }),
          });
          fetchVoteImages();
        } catch (err) {
          console.error("Vote failed", err);
        }
      });
    });
  };

  fetchVoteImages();
});
