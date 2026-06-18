self.addEventListener("install", function(e){
  console.log("NEXA PWA Installed");
});

self.addEventListener("fetch", function(e){
  // basic offline support
});
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("nexa-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/about.html",
        "/services.html",
        "/contact.html",
        "/styles.css"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
