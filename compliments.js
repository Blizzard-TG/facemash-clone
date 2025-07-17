document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("compliment-form");
  const complimentList = document.getElementById("compliment-list");

  const compliments = JSON.parse(localStorage.getItem("compliments") || "[]");
  complimentList.innerHTML = compliments.map(c => `<li>${c}</li>`).join("");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const compliment = form.message.value.trim();
    if (!compliment) return;

    compliments.push(compliment);
    localStorage.setItem("compliments", JSON.stringify(compliments));

    const li = document.createElement("li");
    li.textContent = compliment;
    complimentList.appendChild(li);
    form.reset();
  });
});
