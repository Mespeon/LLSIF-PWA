/*******************************************************/
/* FROM SERVICE WORKER SAMPLE CODES                    */
/*******************************************************/
// Cache WITH network fallback strategy
/*
self.addEventListener('fetch', function(event){
  //console.log('[SW] Fetching stuff...', event);
  event.respondWith(caches.match(event.request).then(function(response) {
    if (response) {
      return response;
    }
    else {
      return fetch(event.request)
      .then(function(resp) {
        return caches.open(CACHE_DYNAMIC_NAME)
        .then(function(cache) {
          cache.put(event.request.url, resp.clone());  // remove to restore automatic dynamic caching
          return resp;
        })
      })
      .catch(function(error) {
        return caches.open(CACHE_STATIC_NAME).then(function(cache) {
          return cache.match('/offline.html');
        })
      });
    }
  }));
});
*/

// Cache only (NO NETWORK REQUEST)
// Useful for assets like the app shell already stored in the cache
/*
self.addEventListener('fetch', function(event){
  //console.log('[SW] Fetching stuff...', event);
  event.respondWith(caches.match(event.request));
});
*/

// Network only (NO CACHE REQUEST)
/*
self.addEventListener('fetch', function(event){
  //console.log('[SW] Fetching stuff...', event);
  event.respondWith(fetch(event.request));
});
*/

// Network then cache fallback strategy
/*
self.addEventListener('fetch', function(event){
  //console.log('[SW] Fetching stuff...', event);
  event.respondWith(
    fetch(event.request).then(function(resp) {
      return caches.open(CACHE_DYNAMIC_NAME)
      .then(function(cache) {
        cache.put(event.request.url, resp.clone());  // remove to restore automatic dynamic caching
        return resp;
      })
    })
    .catch(function(ex) {
        return caches.match(event.request)
    })
  );
});
*/
