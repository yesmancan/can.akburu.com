const StaticCacheName = "site-static-v12";
const dynamicCacheName = "site-dynamic-v12";

var cacheAllowlist = ["site-static-v12", "site-dynamic-v12"];


const assets = [
  "/",
  "/bakim",
  "/montaj",
  "/modernizasyon-ve-revizyon",
  "/hakkimizda",
  "/iletisim",

  "./robots.txt",

  "https://fonts.googleapis.com/css2?family=Montserrat&family=Syne&display=swap",
  "https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.cs",
];

const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches
      .open(StaticCacheName)
      .then((cache) => {
        console.log("caching shell assets");
        cache.addAll(assets);
      })
      .catch((err) => console.log(err))
  );
});
self.addEventListener("active", (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== StaticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});
self.addEventListener("activate", function (event) {

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

//fetch event
self.addEventListener("fetch", (evt) => {
  evt.respondWith(
    caches
      .match(evt.request)
      .then((cacheRes) => {
        // Cache hit - return response
        if (cacheRes) {
          return cacheRes;
        }

        return fetch(evt.request).then((fetchRes) => {
          // Check if we received a valid response
          if (
            !fetchRes ||
            fetchRes.status !== 200 ||
            fetchRes.type !== "basic"
          ) {
            return fetchRes;
          }

          return caches.open(dynamicCacheName).then((cache) => {
            cache.put(evt.request, fetchRes.clone());
            limitCacheSize(dynamicCacheName, 10);
            return fetchRes;
          });
        });
      })
      .catch(() => caches.match("/fallback"))
      .catch((err) => console.log(err))
  );
});
