document.addEventListener('DOMContentLoaded', () => {
  const pendingContainer = document.getElementById('pending-approvals');
  const leaderboardOverrideForm = document.getElementById('leaderboardOverrideForm');

  // Show pending image approvals
  function renderPendingApprovals() {
    const pending = getPendingImages();
    pendingContainer.innerHTML = '';

    pending.forEach((img, index) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <img src="${img.data}" alt="Pending Image" style="width: 100%; max-height: 300px;" />
        <button onclick="approveImage(${index})">Approve</button>
        <button onclick="rejectImage(${index})">Reject</button>
      `;
      pendingContainer.appendChild(card);
    });
  }

  window.approveImage = function(index) {
    approvePendingImage(index);
    renderPendingApprovals();
    alert('Image approved!');
  };

  window.rejectImage = function(index) {
    rejectPendingImage(index);
    renderPendingApprovals();
    alert('Image rejected!');
  };

  leaderboardOverrideForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('overrideEmail').value.trim();
    const newScore = parseInt(document.getElementById('overrideScore').value, 10);
    overrideUserScore(email, newScore);
    alert('Leaderboard score updated!');
    leaderboardOverrideForm.reset();
  });

  renderPendingApprovals();
});
