importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js");
importScripts('/src/js/idb.js');
importScripts('/src/js/util.js');


self.__precacheManifest = [].concat(self.__precacheManifest || []);

// CATCH ALL FROM GOOGLE APIS USING A REGULAR EXPRESSION
workbox.routing.registerRoute(/.*(?:googleapis|gstatic)\.com.*$/, workbox.strategies.staleWhileRevalidate({
  cacheName: 'google-images',
  cacheExpiration: {
    maxEntries: 20,
    maxAgeSeconds: 60 * 120
  }
}));

// INDEXED DB CUSTOM HANDLER
workbox.routing.registerRoute('https://otonokizaka-3a6d9.firebaseio.com/comments.json', function(args) {
  return fetch(args.event.request).then(function(reply) {
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
    });
});

workbox.routing.registerRoute(function(routeData) {
  // routeData.url = returns the URL of the request
  // returns true if the request accepts text/html
  return (routeData.event.request.headers.get('accept').includes('text/html'));
}, function(args) {
    return caches.match(args.event.request).then(function(response) {
      // if request is cached, response with it
      if (response) {
        return response;
      }
      // if not, cache the response, clone it, then response with it
      else {
        // Dynamic caching - useful for per-view caching
        return fetch(args.event.request)
        .then(function(resp) {
          return caches.open('llsif-dynamics')
          .then(function(cache) {
            cache.put(args.event.request.url, resp.clone());  // remove to restore automatic dynamic caching
            return resp;
          })
        })
        // Offline page response
        .catch(function(error) {
          return caches.match('/offline.html').then(function(res) {
            return res;
          });
        });
      }
    });
});

workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute([]);

// SYNC EVENT LISTENER
self.addEventListener('sync', function(event) {
  console.log('[SW Arceus] Background sync in progress. ', event);
  if (event.tag === 'llsif-sync-comment') {
    console.log('[SW Arceus] Attempting to sync comments...');
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

          console.log('[SW Arceus] Logged data from sync-comments IndexedDB and commentData FormData():');
          //console.log(commentData.getAll());
          console.log("ID: " + posts.id + " / " + commentData.get('id'));
          console.log("Avatar File: " + posts.avatar + " / " + commentData.get('avatar'));
          console.log("Timestamp: " + posts.timestamp + " / " + commentData.get('timestamp'));
          console.log("User: " + posts.user + " / " + commentData.get('user'));
          console.log("Comment Text: " + posts.txt + " / " + commentData.get('txt'));

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
            console.log('[SW Arceus] Data sync sent.', response);
            if (response.ok) {
                //clearSpecific('sync-comments', posts.id);
                response.json().then(function(responseData) {
                  clearSpecific('sync-comments', responseData.id);  // delete this from indexedDB
                  console.log('[SW Arceus] Deleting ID from indexedDB: ', responseData.id);
                });
            }
            else {
              console.log('[SW Arceus] Something went wrong. IndexedDB not cleared.');
            }
          }).catch(function(ex) {
            console.log('[SW Arceus] Error occured while sending data.', ex);
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
