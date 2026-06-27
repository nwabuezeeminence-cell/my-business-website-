// ===== NEXA CLEAN SERVICE WORKER =====

const CACHE_NAME = "nexa-cache-v2";

const urlsToCache = [
  "/",
  "/index.html",
  "/about.html",
  "/services.html",
  "/contact.html",
  "/community.html",
  "/chat.html",
  "/groups.html",
  "/profile.html",
  "/login.html",
  "/signup.html",
  "/style.css",
  "/menu.css",
  "/firebase.js"
];

// INSTALL EVENT
self.addEventListener("install", (event) => {
  console.log("NEXA Service Worker Installed");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// FETCH EVENT (Offline support)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// ACTIVATE EVENT (cleanup old cache)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});