document.addEventListener("DOMContentLoaded", () => {
  const leaderboardTable = document.getElementById("leaderboard-table");

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();

      leaderboardTable.innerHTML = `
        <tr>
          <th>Rank</th>
          <th>Image</th>
          <th>Score</th>
        </tr>
      `;

      data.leaderboard.forEach((item, index) => {
        leaderboardTable.innerHTML += `
          <tr>
            <td>${index + 1}</td>
            <td><img src="${item.url}" alt="leader-img" width="100"></td>
            <td>${item.score}</td>
          </tr>
        `;
      });
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
    }
  };

  fetchLeaderboard();
});
