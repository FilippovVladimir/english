// Офлайн-кэш. При изменении файлов увеличь VERSION — телефон подтянет новую версию.
const VERSION = "v5";
const FILES = [
  "./", "index.html", "styles.css", "app.js", "manifest.webmanifest",
  "data/categories.js", "data/phrases-1-basics.js", "data/phrases-2-grammar.js",
  "data/phrases-3-rude.js", "data/phrases-4-media.js", "data/phrases-5-life.js", "data/words.js",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// Сначала сеть (чтобы видеть свежие фразы), при отсутствии интернета — кэш.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(VERSION).then((c) => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
