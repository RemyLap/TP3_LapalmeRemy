// Comportements partagés entre toutes les pages (horloge, barre de statut, navigation).
// À compléter à l'étape "barre de statut / barre d'adresse".

// Effet écran CRT rétro : overlay purement décoratif injecté sur chaque page
// depuis un seul fichier JS pour éviter de dupliquer le markup dans les 4 HTML.
const crtOverlay = document.createElement("div");
crtOverlay.className = "crt-overlay";
crtOverlay.setAttribute("aria-hidden", "true");
crtOverlay.innerHTML =
  '<div class="crt-overlay__scanlines"></div>' +
  '<div class="crt-overlay__aberration"></div>' +
  '<div class="crt-overlay__static"></div>' +
  '<div class="crt-overlay__glitch"></div>' +
  '<div class="crt-overlay__sweep"></div>' +
  '<div class="crt-overlay__vignette"></div>' +
  '<div class="crt-overlay__flicker"></div>';
document.body.appendChild(crtOverlay);

// Easter egg : les boutons de barre de titre (réduire/agrandir/fermer) ne
// font rien de fonctionnel — ils ouvrent une fausse popup système, dans le
// même style que celles de l'accueil, sur n'importe quelle page.
function showControlPopup(message) {
  const existing = document.querySelector("[data-control-popup]");
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.className = "popup popup--overlay";
  popup.setAttribute("data-control-popup", "");
  popup.setAttribute("role", "alertdialog");
  popup.setAttribute("aria-label", "Système");
  popup.innerHTML =
    '<header class="popup__titlebar">' +
    '<h2 class="popup__title">Système</h2>' +
    '<button class="popup__close" type="button" aria-label="Fermer"></button>' +
    "</header>" +
    '<div class="popup__body"><p>' +
    message +
    "</p></div>";

  document.body.appendChild(popup);

  popup.querySelector(".popup__close").addEventListener("click", () => {
    popup.classList.add("popup--closing");
    popup.addEventListener("animationend", () => popup.remove(), { once: true });
  });
}

const windowControlSelector =
  ".window__control--minimize, .window__control--maximize, .window__control--close, " +
  ".dialog__control--minimize, .dialog__control--maximize, .dialog__control--close";

document.querySelectorAll(windowControlSelector).forEach((button) => {
  button.addEventListener("click", () => {
    let alreadyClicked = false;
    try {
      alreadyClicked = localStorage.getItem("system-controls-clicked") === "true";
      localStorage.setItem("system-controls-clicked", "true");
    } catch {
      // Stockage indisponible (navigation privée, etc.) : toujours le premier message.
    }
    showControlPopup(alreadyClicked ? "Tu n'as nulle part où te cacher." : "Tout va bien.");
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
