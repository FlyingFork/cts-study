const CACHE_NAME = "study-platform-v1";
const CORE_URLS = ["/", "/progress", "/service-worker.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

function shouldCache(request) {
  if (request.method !== "GET") return false;
  const url = new URL(request.url);
  return url.origin === self.location.origin;
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    const shell = await cache.match("/");
    if (shell) return shell;
    throw new Error("Offline and no cached response available.");
  }
}

self.addEventListener("fetch", (event) => {
  if (!shouldCache(event.request)) return;
  const url = new URL(event.request.url);
  const isAsset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/courses/") ||
    url.pathname.startsWith("/pyodide/") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".csv") ||
    url.pathname.endsWith(".xlsx") ||
    url.pathname.endsWith(".wasm") ||
    url.pathname.endsWith(".whl") ||
    url.pathname.endsWith(".zip");

  event.respondWith(isAsset ? cacheFirst(event.request) : networkFirst(event.request));
});
