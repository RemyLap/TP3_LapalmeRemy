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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
