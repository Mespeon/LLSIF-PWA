importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js");


self.__precacheManifest = [].concat(self.__precacheManifest || []);

// CATCH ALL FROM GOOGLE APIS USING A REGULAR EXPRESSION
workbox.routing.registerRoute(/.*(?:googleapis|gstatic)\.com.*$/, workbox.strategies.staleWhileRevalidate({
  cacheName: 'google-icons'
}));

// CATCH ALL REQUESTS FROM FIREBASE
workbox.routing.registerRoute(/.*(?:firebasestorage\.googleapis)\.com.*$/, workbox.strategies.staleWhileRevalidate({
  cacheName: 'firebase-thumbnails'
}));

workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute([]);
