//! vote.js

async function fetchVoteImages() {
  const allImages = JSON.parse(localStorage.getItem("images") || "[]");
  const approvedImages = allImages.filter(img => img.approved);

  if (approvedImages.length < 2) {
    document.getElementById("vote-container").innerHTML = "<p>Not enough approved images to vote.</p>";
    return;
  }

  const shuffled = approvedImages.sort(() => 0.5 - Math.random());
  const [img1, img2] = shuffled.slice(0, 2);

  document.getElementById("img1").src = img1.data;
  document.getElementById("img2").src = img2.data;
  document.getElementById("img1").dataset.name = img1.name;
  document.getElementById("img2").dataset.name = img2.name;
}

function castVote(winnerName) {
  const votes = JSON.parse(localStorage.getItem("votes") || "{}");
  votes[winnerName] = (votes[winnerName] || 0) + 1;
  localStorage.setItem("votes", JSON.stringify(votes));
  fetchVoteImages();
}

document.addEventListener("DOMContentLoaded", () => {
  fetchVoteImages();
  document.getElementById("img1").addEventListener("click", () => castVote(document.getElementById("img1").dataset.name));
  document.getElementById("img2").addEventListener("click", () => castVote(document.getElementById("img2").dataset.name));
});

