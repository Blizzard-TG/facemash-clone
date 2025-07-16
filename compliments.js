document.addEventListener('DOMContentLoaded', () => {
  const complimentForm = document.getElementById('complimentForm');
  const complimentList = document.getElementById('complimentList');

  function renderCompliments() {
    const compliments = getAllCompliments();
    complimentList.innerHTML = '';
    compliments.forEach(c => {
      const div = document.createElement('div');
      div.classList.add('card');
      div.innerHTML = `<strong>${c.from}</strong>: ${c.message}`;
      complimentList.appendChild(div);
    });
  }

  complimentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const from = localStorage.getItem('loggedInUser');
    const message = document.getElementById('complimentText').value;
    if (!from) {
      alert('You must be logged in to leave a compliment.');
      return;
    }
    addCompliment(from, message);
    complimentForm.reset();
    renderCompliments();
  });

  renderCompliments();
});
