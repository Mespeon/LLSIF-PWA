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
workbox.precaching.precacheAndRoute([
  {
    "url": "404.html",
    "revision": "0a27a4163254fc8fce870c8cc3a3f94f"
  },
  {
    "url": "favicon.ico",
    "revision": "33a36d3c855cf5c896cafb21f671a2a2"
  },
  {
    "url": "index.html",
    "revision": "24df8bd2dd30b3edfb3b580bb7c12dca"
  },
  {
    "url": "manifest.json",
    "revision": "3d512578a3530b997872b555319f224f"
  },
  {
    "url": "offline.html",
    "revision": "4f07984e588ab86b0cda4d9dca31f1cb"
  },
  {
    "url": "src/css/fonts.css",
    "revision": "4a28572f61033ba4b540a978e66bd6c3"
  },
  {
    "url": "src/css/muse.css",
    "revision": "01c0fb5124e65b5eff52e89b0ba90ec5"
  },
  {
    "url": "src/fonts/Montserrat-Black.ttf",
    "revision": "6d1796a9f798ced8961baf3c79f894b6"
  },
  {
    "url": "src/fonts/Montserrat-Bold.ttf",
    "revision": "88932dadc42e1bba93b21a76de60ef7a"
  },
  {
    "url": "src/fonts/Montserrat-Medium.ttf",
    "revision": "a98626e1aef6ceba5dfc1ee7112e235a"
  },
  {
    "url": "src/fonts/Montserrat-Regular.ttf",
    "revision": "9c46095118380d38f12e67c916b427f9"
  },
  {
    "url": "src/fonts/OpenSans-Bold.ttf",
    "revision": "f5331cb6372b6c0d8baf2dd7e200498c"
  },
  {
    "url": "src/fonts/OpenSans-Light.ttf",
    "revision": "9ff12f694e5951a6f51a9d63b05062e7"
  },
  {
    "url": "src/fonts/OpenSans-Regular.ttf",
    "revision": "d7d5d4588a9f50c99264bc12e4892a7c"
  },
  {
    "url": "src/fonts/OpenSans-SemiBold.ttf",
    "revision": "e1c83f9474e0cc1d84a13c6d1ddf3ca5"
  },
  {
    "url": "src/fonts/rbt_Black.ttf",
    "revision": "f3fa86edfc2b810bf7a3ea7cf010d292"
  },
  {
    "url": "src/fonts/rbt_Bold.ttf",
    "revision": "e31fcf1885e371e19f5786c2bdfeae1b"
  },
  {
    "url": "src/fonts/rbt_cndBold.ttf",
    "revision": "7ff4438405bfb9fe87b606ca356ba6a0"
  },
  {
    "url": "src/fonts/rbt_cndBoldItalic.ttf",
    "revision": "14029990066c7a7de585796da3051274"
  },
  {
    "url": "src/fonts/rbt_cndLight.ttf",
    "revision": "cf4449c1884598b292630aa9f4007c19"
  },
  {
    "url": "src/fonts/rbt_cndLightItalic.ttf",
    "revision": "52019ea2430e3a035f4c458f318bec4c"
  },
  {
    "url": "src/fonts/rbt_cndRegular.ttf",
    "revision": "e6fd95f0cb839566476ec9b6df34849c"
  },
  {
    "url": "src/fonts/rbt_Light.ttf",
    "revision": "46e48ce0628835f68a7369d0254e4283"
  },
  {
    "url": "src/fonts/rbt_Med.ttf",
    "revision": "894a2ede85a483bf9bedefd4db45cdb9"
  },
  {
    "url": "src/fonts/rbt_Regular.ttf",
    "revision": "3e1af3ef546b9e6ecef9f3ba197bf7d2"
  },
  {
    "url": "src/fonts/rbt_Thin.ttf",
    "revision": "94998475f6aea65f558494802416c1cf"
  },
  {
    "url": "src/fonts/rbt_ThinItalic.ttf",
    "revision": "8f066370a8530a3f3e971b8e274b7ddf"
  },
  {
    "url": "src/fonts/RobotoSlab-Bold.ttf",
    "revision": "d63ef23299458362f3edbf6cd8c2c510"
  },
  {
    "url": "src/fonts/RobotoSlab-Light.ttf",
    "revision": "79754934891c17dd798ca5e7eb5fa9a9"
  },
  {
    "url": "src/fonts/RobotoSlab-Regular.ttf",
    "revision": "1ec06eed11bbcb1ee510b8f3522adea8"
  },
  {
    "url": "src/fonts/RobotoSlab-Thin.ttf",
    "revision": "317a4210ef29a41c456503c8e5951448"
  },
  {
    "url": "src/js/min/app.min.js",
    "revision": "a92408040947fb985dfc59a0d5dadb64"
  },
  {
    "url": "src/js/min/feed.min.js",
    "revision": "b0cf966f4fe9f5b981dcd33accd4d889"
  },
  {
    "url": "src/js/min/fetch.min.js",
    "revision": "f044946c220164eed257b4e2fcb39234"
  },
  {
    "url": "src/js/min/idb.min.js",
    "revision": "88ae80318659221e372dd0d1da3ecf9a"
  },
  {
    "url": "src/js/min/jquery-3.1.1.min.js",
    "revision": "e071abda8fe61194711cfc2ab99fe104"
  },
  {
    "url": "src/js/min/jquery-ui.min.js",
    "revision": "32bb69af59ef8f2bcce7d8f35365d0b7"
  },
  {
    "url": "src/js/min/muse.min.js",
    "revision": "62c48fd5c61cd28de3743eceef7ccd4c"
  },
  {
    "url": "src/js/min/promise.min.js",
    "revision": "3468ef1e50a211ea36c24d4abd41062b"
  },
  {
    "url": "src/js/min/util.min.js",
    "revision": "448b454ddc175e18b54258f0f94abc09"
  },
  {
    "url": "src/images/llsif-aqours-group-2.jpg",
    "revision": "56dad56b81953d98166b7fc43aeb9607"
  },
  {
    "url": "src/images/llsif-aqours-group-3.jpg",
    "revision": "cf69789795a4a011376075028152e1a6"
  },
  {
    "url": "src/images/llsif-title-muse.jpg",
    "revision": "64e9475a4550269f615ff19ce7a10661"
  },
  {
    "url": "src/images/mfs-image-sfw.jpg",
    "revision": "a71d9e3d79b13c1194fdd3248a8565a1"
  },
  {
    "url": "src/images/mfs-image-small.jpg",
    "revision": "8aae1014f4eea2d46f1747c5778e7744"
  },
  {
    "url": "src/images/mfs-image.jpeg",
    "revision": "0781c9ea39a9cd484b13cae01dcdf538"
  },
  {
    "url": "src/images/muse-group.jpg",
    "revision": "4f6ec027937ad290921459c57b4f7f80"
  },
  {
    "url": "src/images/muse-momoland-cover-2.png",
    "revision": "df867051782fd715ae77e3d272c742f8"
  }
]);

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
