const restoreButton = document.querySelector("[data-restore-button]");
const trashList = document.querySelector("[data-trash-list]");
const trashHint = document.querySelector("[data-trash-hint]");
const restoreStatus = document.querySelector("[data-restore-status]");
const countEl = document.querySelector('[data-summary="count"]');
const sizeEl = document.querySelector('[data-summary="size"]');

restoreButton.addEventListener("click", () => {
  const items = document.querySelectorAll("[data-trash-item]");
  if (items.length === 0) return;

  restoreButton.disabled = true;

  items.forEach((item) => {
    item.classList.add("trash-list__item--removing");
    item.addEventListener("animationend", () => item.remove(), { once: true });
  });

  countEl.textContent = "0";
  sizeEl.textContent = "0 Mo";
  restoreStatus.textContent = "Tous les éléments ont été restaurés.";

  setTimeout(() => {
    const mystery = document.createElement("li");
    mystery.className = "trash-list__item trash-list__item--mystery";
    mystery.innerHTML = `
      <span class="folder-icon folder-icon--small folder-icon--corrupted" aria-hidden="true"></span>
      <span class="trash-list__name">fichier_ombre.sys</span>
    `;
    trashList.appendChild(mystery);
    trashHint.hidden = false;
    restoreButton.textContent = "Tout a été restauré";
  }, 500);
});
