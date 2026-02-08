/// <reference lib="webworker" />

const CACHE_NAME = "nexus-v1";
const STATIC_ASSETS = [
  "/",
  "/offline",
  "/manifest.json",
];

declare const self: ServiceWorkerGlobalScope;

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip API and auth routes
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/auth")) {
    return;
  }

  // Skip external requests
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone the response before caching
        const responseClone = response.clone();
        
        // Cache successful responses for static assets
        if (response.ok && isStaticAsset(url.pathname)) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        
        return response;
      })
      .catch(async () => {
        // Try cache for failed requests
        const cached = await caches.match(request);
        if (cached) return cached;

        // Return offline page for navigation requests
        if (request.mode === "navigate") {
          const offlinePage = await caches.match("/offline");
          if (offlinePage) return offlinePage;
        }

        // Return a basic error response
        return new Response("Network error", { status: 503 });
      })
  );
});

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.endsWith(".js") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".woff2") ||
    pathname.startsWith("/_next/static/")
  );
}

// Listen for messages from the client
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

export {};
