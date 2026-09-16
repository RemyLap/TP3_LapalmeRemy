const restoreAllButton = document.querySelector("[data-restore-button]");
const restoreStatus = document.querySelector("[data-restore-status]");
const mysteryItem = document.querySelector("[data-mystery-item]");
const contextMenu = document.querySelector("[data-context-menu]");
const countEl = document.querySelector('[data-summary="count"]');
const sizeEl = document.querySelector('[data-summary="size"]');
const statusbarCountEl = document.querySelector("[data-statusbar-count]");

let activeItem = null;

const RESOLVED_STORAGE_KEY = "system-corbeille-resolved-ids";

function getResolvedIds() {
  try {
    return JSON.parse(localStorage.getItem(RESOLVED_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function markIdResolved(id) {
  if (!id) return;
  try {
    const ids = getResolvedIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(RESOLVED_STORAGE_KEY, JSON.stringify(ids));
    }
  } catch {
    // Stockage indisponible (navigation privée, etc.) : l'état ne persistera pas.
  }
}

function pendingItems() {
  return document.querySelectorAll("[data-trash-item]:not(.trash-list__item--resolved):not([data-mystery-item])");
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
  // Pas de vrai `disabled` : les navigateurs forcent le curseur natif sur les
  // boutons désactivés, peu importe le CSS. Le clic ne fait déjà plus rien
  // une fois la liste vide (pendingItems().forEach sur un tableau vide).
  restoreAllButton.setAttribute("aria-disabled", "true");
}

function resolveItem_(item, message) {
  if (item.classList.contains("trash-list__item--resolved")) return;

  item.classList.add("trash-list__item--restoring");
  item.addEventListener(
    "animationend",
    () => {
      item.classList.remove("trash-list__item--restoring");
      item.classList.add("trash-list__item--resolved");
      item.disabled = true;
      markIdResolved(item.dataset.id);

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

function resolveMystery(message) {
  if (mysteryItem.classList.contains("trash-list__item--resolved")) return;

  mysteryItem.classList.add("trash-list__item--restoring");
  mysteryItem.addEventListener(
    "animationend",
    () => {
      mysteryItem.classList.remove("trash-list__item--restoring");
      mysteryItem.classList.add("trash-list__item--resolved");
      restoreStatus.textContent = message;
      try {
        localStorage.setItem("system-mystery-file-resolved", "true");
      } catch {
        // Stockage indisponible (navigation privée, etc.) : l'état ne persistera pas.
      }
    },
    { once: true }
  );
}

function restoreItem(item) {
  if (item === mysteryItem) {
    resolveMystery("Fichier mystère restauré. Curieux, non ?");
    try {
      localStorage.setItem("system-mystery-file-restored", "true");
    } catch {
      // Stockage indisponible (navigation privée, etc.) : tant pis pour l'easter egg.
    }
  } else {
    resolveItem_(item, "Élément restauré.");
  }
}

function deleteItem(item) {
  if (item === mysteryItem) {
    resolveMystery("Fichier mystère supprimé. Pour de bon, cette fois ?");
  } else {
    resolveItem_(item, "Élément supprimé définitivement.");
  }
}

// Réappliquer instantanément (sans transition ni animation) l'état
// sauvegardé d'une précédente visite : un dossier restauré/supprimé le
// reste après un rechargement de la page, sans le voir réapparaître puis
// disparaître à chaque changement de page.
function hideInstantly(item) {
  item.style.transition = "none";
  item.classList.add("trash-list__item--resolved");
  void item.offsetHeight;
  requestAnimationFrame(() => {
    item.style.transition = "";
  });
}

const resolvedIds = getResolvedIds();
document.querySelectorAll("[data-trash-item][data-id]").forEach((item) => {
  if (!resolvedIds.includes(item.dataset.id)) return;
  hideInstantly(item);
  const trigger = item.querySelector("[data-trash-trigger]");
  if (trigger) trigger.disabled = true;
});
updateSummary();
if (pendingItems().length === 0) {
  let mysteryResolved = false;
  try {
    mysteryResolved = localStorage.getItem("system-mystery-file-resolved") === "true";
  } catch {
    // Stockage indisponible : le fichier mystère réapparaît, tant pis.
  }

  if (mysteryResolved) mysteryItem.style.transition = "none";
  revealMysteryFile();
  if (mysteryResolved) {
    mysteryItem.classList.add("trash-list__item--resolved");
    const mysteryTrigger = mysteryItem.querySelector("[data-trash-trigger]");
    if (mysteryTrigger) mysteryTrigger.disabled = true;
    void mysteryItem.offsetHeight;
    requestAnimationFrame(() => {
      mysteryItem.style.transition = "";
    });
  }
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
