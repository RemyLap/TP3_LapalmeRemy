// Comportements partagés entre toutes les pages (horloge, barre de statut, navigation).
// À compléter à l'étape "barre de statut / barre d'adresse".

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
