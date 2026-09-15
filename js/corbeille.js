const restoreAllButton = document.querySelector("[data-restore-button]");
const restoreStatus = document.querySelector("[data-restore-status]");
const mysteryItem = document.querySelector("[data-mystery-item]");
const contextMenu = document.querySelector("[data-context-menu]");
const countEl = document.querySelector('[data-summary="count"]');
const sizeEl = document.querySelector('[data-summary="size"]');
const statusbarCountEl = document.querySelector("[data-statusbar-count]");

let activeItem = null;

function pendingItems() {
  return document.querySelectorAll("[data-trash-item]:not(.trash-list__item--resolved)");
}

function updateSummary() {
  const items = pendingItems();
  const totalSize = Array.from(items).reduce((sum, item) => sum + parseFloat(item.dataset.size), 0);
  countEl.textContent = items.length;
  sizeEl.textContent = `${totalSize.toFixed(1).replace(".", ",")} Mo`;
  statusbarCountEl.textContent = `${items.length} objet(s)`;
}

function revealMysteryFile() {
  mysteryItem.classList.add("trash-list__item--revealed");
  mysteryItem.setAttribute("aria-hidden", "false");
  restoreAllButton.textContent = "Tout a été restauré";
  restoreAllButton.disabled = true;
}

function resolveItem(item, message) {
  if (item.classList.contains("trash-list__item--resolved")) return;

  item.classList.add("trash-list__item--restoring");
  item.addEventListener(
    "animationend",
    () => {
      item.classList.remove("trash-list__item--restoring");
      item.classList.add("trash-list__item--resolved");
      item.disabled = true;

      updateSummary();

      if (pendingItems().length === 0) {
        restoreStatus.textContent = "Tous les éléments ont été traités.";
        revealMysteryFile();
      } else {
        restoreStatus.textContent = message;
      }
    },
    { once: true }
  );
}

function restoreItem(item) {
  resolveItem(item, "Élément restauré.");
}

function deleteItem(item) {
  resolveItem(item, "Élément supprimé définitivement.");
}

let activeTrigger = null;

function openMenu(item, trigger) {
  activeItem = item;
  activeTrigger = trigger;
  const rect = trigger.getBoundingClientRect();
  contextMenu.style.top = `${rect.bottom}px`;
  contextMenu.style.left = `${rect.left}px`;
  contextMenu.hidden = false;
  contextMenu.querySelector('[data-menu-action="restore"]').focus();
}

function closeMenu() {
  contextMenu.hidden = true;
  activeItem = null;
  if (activeTrigger && !activeTrigger.disabled) {
    activeTrigger.focus();
  }
  activeTrigger = null;
}

document.querySelector("[data-trash-list]").addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-trash-trigger]");
  if (!trigger) return;
  const item = trigger.closest("[data-trash-item]");
  if (!item || item.classList.contains("trash-list__item--resolved")) return;
  openMenu(item, trigger);
});

contextMenu.querySelectorAll("[data-menu-action]").forEach((item) => {
  item.addEventListener("mouseenter", () => item.focus());
});

contextMenu.addEventListener("click", (event) => {
  const action = event.target.closest("[data-menu-action]");
  if (!action || !activeItem) return;
  if (action.dataset.menuAction === "restore") {
    restoreItem(activeItem);
  } else if (action.dataset.menuAction === "delete") {
    deleteItem(activeItem);
  }
  closeMenu();
});

document.addEventListener("click", (event) => {
  if (contextMenu.hidden) return;
  if (contextMenu.contains(event.target) || event.target.closest("[data-trash-item]")) return;
  closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !contextMenu.hidden) closeMenu();
});

restoreAllButton.addEventListener("click", () => {
  pendingItems().forEach(restoreItem);
});
