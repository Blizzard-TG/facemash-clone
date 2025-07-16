//! leaderboard.js

document.addEventListener("DOMContentLoaded", () => {
  const votes = JSON.parse(localStorage.getItem("votes") || "{}");
  const entries = Object.entries(votes).sort((a, b) => b[1] - a[1]);
  const tbody = document.querySelector("#leaderboard-table tbody");
  tbody.innerHTML = "";

  entries.forEach(([name, score], index) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${index + 1}</td><td>${name}</td><td>${score}</td>`;
    tbody.appendChild(row);
  });
});
