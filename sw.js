const CACHE_NAME = "tp3-system-v48";

const PRECACHE_URLS = [
  "index.html",
  "dossiers.html",
  "demande.html",
  "corbeille.html",
  "css/output.css",
  "js/main.js",
  "js/accueil.js",
  "js/dossiers.js",
  "js/demande.js",
  "js/corbeille.js",
  "manifest.webmanifest",
  "assets/icons/icon-144.png",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/icons/recycle-bin.png",
  "assets/fonts/w95fa.woff2",
  "assets/fonts/w95fa.woff",
];

// Enregistre une réponse "propre" (flag redirected remis à zéro) dans le
// cache, pour éviter qu'une page mise en cache via une redirection (ex.
// serveur local "serve" qui redirige .html vers une URL sans extension) ne
// puisse plus jamais être utilisée pour répondre à une navigation.
async function cachePut(cache, request, response) {
  const safeResponse = response.redirected
    ? new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      })
    : response;
  await cache.put(request, safeResponse);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.all(
          PRECACHE_URLS.map((url) => fetch(url, { redirect: "follow" }).then((response) => cachePut(cache, url, response)))
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Les requêtes de navigation imposent redirect:"manual" sur event.request.
  // Le navigateur refuse qu'on réponde avec une Response dont le flag
  // "redirected" est vrai (ex. si le serveur local redirige .html vers une
  // URL sans extension) : on reconstruit donc une Response neutre à partir
  // du corps/statut/en-têtes plutôt que de renvoyer directement la réponse
  // suivie de redirection.
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((cached) => {
        if (cached) return cached;

        return fetch(event.request.url, { redirect: "follow" })
          .then((response) => {
            const safeResponse = response.redirected
              ? new Response(response.body, {
                  status: response.status,
                  statusText: response.statusText,
                  headers: response.headers,
                })
              : response;
            if (response.ok) {
              caches.open(CACHE_NAME).then((cache) => cachePut(cache, event.request, safeResponse.clone()));
            }
            return safeResponse;
          })
          .catch(() => caches.match("index.html"));
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => cachePut(cache, event.request, response.clone()));
          }
          return response;
        })
        .catch(() => Response.error());
    })
  );
});
