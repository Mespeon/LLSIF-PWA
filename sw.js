var CACHE_STATIC_NAME = 'llsifStatics-106';
var CACHE_DYNAMIC_NAME = 'llsifDynamics-24';
var STATIC_ASSETS = ['/',
'/index.html',
'/offline.html',
'/src/js/app.js',
'/src/js/feed.js',
'/src/js/promise.js',
'/src/js/fetch.js',
'/src/js/muse.js',
'/src/css/app.css',
'/src/css/feed.css',
'/src/css/muse.css',
'/src/js/jquery-3.1.1.min.js'];

// CACHE CLEANUP
function cleanCache(cacheName, maxItems) {
  caches.open(cacheName)
    .then(function(cache) {
      return cache.keys()
      .then(function(keys) {
      if (keys.length  > maxItems) {
        cache.delete(keys[0]).then(cleanCache(cacheName, maxItems)); // recursive call
      }
    });
  })
}

// Event listener for SW install with static asset caching
self.addEventListener('install', function(event){
  console.log('[SW] Installing...', event);
  /* DISABLE STATIC CACHE - REMOVE ONCE DONE */
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then(function(cache) {
      console.log('[SW] Precaching...');
      cache.addAll(STATIC_ASSETS);
    })
  )
});

// Event listener for SW activate
self.addEventListener('activate', function(event){
  console.log('[SW] Activating...', event);
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key){
        if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
          console.log('[SW] Removing cache: ', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// Helper for the fetch method
// loop throught static files without regexp
function isInArray(string, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === string) {
      return true;
    }
  }
  return false;
}

// Cache then network MODIFIED
// (good for quickly providing on-screen content; bad for offline mode)
self.addEventListener('fetch', function(event){
  // Clean up cache before pushing through fetch
  //return console.log('[SW] Cleaning cache before fetch...');
  //cleanCache(CACHE_DYNAMIC_NAME, 10);

  var source_url = 'https://httpbin.org/get'; // Use only cache THEN network for this URL

  if (event.request.url.indexOf(source_url) > -1) {
    // Store into cache if response is positive (cache > network)
    event.respondWith(
      caches.open(CACHE_DYNAMIC_NAME).then(function(cache) {
        return fetch(event.request).then(function(reply) {
          return console.log('[SW] Cleaning cache during fetch...');
          cleanCache(CACHE_DYNAMIC_NAME, 10);
          cache.put(event.request, reply.clone());
          return reply;
        });
      })
    );
  }
  // Cache only with routing (METHOD DOES NOT ATTEMPT TO USE NETWORK IF ASSETS ARE NOT CACHED)
  // Check first if request URL contains the STATIC_ASSETS
  // \\b = word boundaries
  else if (isInArray(event.request.url, STATIC_ASSETS)) {
    event.respondWith(caches.match(event.request)); // respond with cache
  }
  // Use cache WITH network for everything else
  else {
    // Response with contents from cache
    event.respondWith(caches.match(event.request).then(function(response) {
      // if request is cached, response with it
      if (response) {
        return response;
      }
      // if not, cache the response, clone it, then response with it
      else {
        // Dynamic caching - useful for per-view caching
        return fetch(event.request)
        .then(function(resp) {
          return caches.open(CACHE_DYNAMIC_NAME)
          .then(function(cache) {
            cache.put(event.request.url, resp.clone());  // remove to restore automatic dynamic caching
            return resp;
          })
        })
        // Offline page response
        .catch(function(error) {
          return caches.open(CACHE_STATIC_NAME).then(function(cache) {
            // Custom offline page response for specific URL requests
            // if (event.request.url.indexOf('url')) {}
            // Custom offline page response for general purposes
            // USEFUL FOR FALLBACK ITEMS (photos, text, css)
            // Precache, check headers, return
            if (event.request.headers.get('accept').includes('text/html')) {
              return cache.match('/offline.html');
            }
          });
        });
      }
    }));
  }
});
