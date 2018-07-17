
importScripts('/src/js/idb.js');
importScripts('/src/js/util.js');

var CACHE_STATIC_NAME = 'llsifStatics-533';
var CACHE_DYNAMIC_NAME = 'llsifDynamics-152';
var STATIC_ASSETS = ['/',
'/index.html',
'/offline.html',
'/src/js/muse.js',
'/src/js/app.js',
'/src/js/util.js',
'/src/js/feed.js',
'/src/js/idb.js',
'/src/js/promise.js',
'/src/js/fetch.js',
'/src/js/jquery-3.1.1.min.js',
'/src/js/jquery-ui.js',
'/src/images/mfs-image-small.jpg',
'/src/images/muse-momoland-cover.jpg',
'/src/css/muse.css',
'/src/css/fonts.css',
'/src/css/widescreen.css'];

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

  //var source_url = 'https://httpbin.org/get'; // Use only cache THEN network for this URL
  var source_url = 'https://otonokizaka-3a6d9.firebaseio.com/comments';
  if (event.request.url.indexOf(source_url) > -1) {
    // Store into cache if response is positive (cache > network)
    event.respondWith(fetch(event.request).then(function(reply) {
          // return console.log('[SW] Cleaning cache during fetch...');
          // cleanCache(CACHE_DYNAMIC_NAME, 10);
          // cache.put(event.request, reply.clone());

          // USING INDEXEDDB FOR DYNAMIC CONTENT
          var clonedReply = reply.clone();
          clearThis('comments').then(function() {
            clonedReply.json().then(function(replyData) {
                for (var key in replyData) {
                    writeThis('comments', replyData[key]);
                }
            });
          });
          return reply;
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
    // CACHE WITH NETWORK FALLBACK
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

// SYNC EVENT LISTENER
self.addEventListener('sync', function(event) {
  console.log('[SW] Background sync in progress. ', event);
  if (event.tag === 'llsif-sync-comment') {
    console.log('[SW] Attempting to sync comments...');
    event.waitUntil(
      readThis('sync-comments').then(function(data) {
        for (var posts of data) {
          // https://otonokizaka-3a6d9.firebaseio.com/comments.json

          // APPEND FORM DATA AS KEY PAIRS
          var commentData = new FormData();
          commentData.append('id', posts.id);
          commentData.append('avatar', posts.avatar, posts.id + '.png');
          commentData.append('timestamp', posts.id);
          commentData.append('user', posts.user);
          commentData.append('txt', posts.txt);

          console.log('[SW] Logged data from sync-comments IndexedDB and commentData FormData():');
          //console.log(commentData.getAll());
          console.log("ID: " + posts.id + " " + commentData.get('id'));
          console.log("Avatar File: " + posts.avatar + " " + commentData.get('avatar'));
          console.log("Timestamp: " + posts.timestamp + " " + commentData.get('timestamp'));
          console.log("User: " + posts.user + " " + commentData.get('user'));
          console.log("Comment Text: " + posts.txt + " " + commentData.get('txt'));

          fetch('https://us-central1-otonokizaka-3a6d9.cloudfunctions.net/storeCommentData', {
            method: 'POST',
            /*
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },*/
            body: commentData
            /*
            JSON.stringify({
              // FOLLOW STRUCTURE FORMAT IN FIREBASE
              id: posts.id,
              avatar: 'https://firebasestorage.googleapis.com/v0/b/otonokizaka-3a6d9.appspot.com/o/default.jpg?alt=media&token=b8736d57-e915-41f4-8f68-9ace1496c45e',
              timestamp: posts.id,
              user: posts.user,
              txt: posts.txt
            })
            */
          }).then(function(response) {
            console.log('[SW] Data sync sent.', response);
            if (response.ok) {
                //clearSpecific('sync-comments', posts.id);
                response.json().then(function(responseData) {
                  clearSpecific('sync-comments', responseData.id);  // delete this from indexedDB
                  console.log('[SW] Deleting ID from indexedDB: ', responseData.id);
                });
            }
            else {
              console.log('[SW] Something went wrong. IndexedDB not cleared.');
            }
          }).catch(function(ex) {
            console.log('[SW] Error occured while sending data.', ex);
          });
        }
      })
    );
  }
});

// ACTIONS ON NOTIFICATION CLICK
self.addEventListener('notificationclick', function(event) {
  // DETERMINE THE NOTIFICATION
  var notification = event.notification;
  var action = event.action;

  console.log('[SW] Interacted with notification: ', notification);

  if (action === 'confirm') {
    console.log('[SW] Notification action selected: ', action);
    notification.close();
  }
  else {
    console.log('[SW] Notification action selected: ', action);
    // DO THIS FOR ALL ACTIONS THAT ARE NOT CONFIRMATORY
    // This will open or refresh the page if the notification is clicked.
    event.waitUntil(
      clients.matchAll().then(function(handledClients) {
        var clientsFound = handledClients.find(function(c) {
          return c.visibilityState === 'visible';
        });

        // Open a page in browser
        if (clientsFound !== undefined) {
          clientsFound.navigate(notification.data.url);
          clientsFound.focus();
        }
        else {
          // Refresh page if a window is found
          clients.openWindow(notification.data.url);
        }
        notification.close();
      })
    );
  }
});

// ACTIONS ON NOTIFICATION CLOSE
self.addEventListener('notificationclose', function(event) {
  console.log('[SW] Notification was closed. ', event);
});

// ACTIONS ON PUSH RECEIVE
self.addEventListener('push', function(event) {
  console.log('[SW] Incoming push message received.', event);

  var payLoad = {title: 'No title', content: 'No content', openUrl: '/404.html'};
  if (event.data) {
    payLoad = JSON.parse(event.data.text());
  }

  var options = {
    body: payLoad.content,
    icon: '/src/images/icons/nozomi/app-icon-96x96.png',
    badge: '/src/images/icons/nozomi/app-icon-96x96.png',
    data: {
      url: payLoad.openUrl
    }  // passes extra metadata to the notification
  }

  event.waitUntil(self.registration.showNotification(payLoad.title, options));
});

// RECEIVE MESSAGE FROM CLIENT
// Handling of messages received from client will be handled here
self.addEventListener('message', function(event) {
  console.log('[SW] Received a message: ' + event.data);
  switch(event.data) {
    case 'sync-complete':
      event.ports[0].postMessage('sync-complete');
      break;

    case 'sync-failed':
      event.ports[0].postMessage('sync-failed');
      break;

    case 'sync-attempt':
      event.ports[0].postMessage('sync-attempt');
      break;

    default:
      event.ports[0].postMessage('testing');
  }
  //event.ports[0].postMessage('sync-ok');
});
