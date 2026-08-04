// Minimal service worker — placeholder for now.
// We'll build out proper offline caching (viewed school listings, etc.)
// in the dedicated PWA step later. This just makes the app installable
// and avoids a 404 when the browser looks for /sw.js.

const CACHE_NAME = "school-directory-shell-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Pass-through for now — no caching logic yet.
  event.respondWith(fetch(event.request));
});
