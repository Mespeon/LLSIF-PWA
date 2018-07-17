var deferPrompt;
var enableNotificationButton = document.querySelector('#enableNotification');
var thisDocument = document.querySelector('body');

if (!window.Promise) {
  window.Promise = Promise;
}

// Check service worker availability in browser
if ('serviceWorker' in navigator){
  // Register service worker
  navigator.serviceWorker.register('/arceus.js')
  .then(function() {
    console.log('Service worker is registered.');
  }).catch(function(error) {
    console.log(error.code, error.message);
  });
}

// SW LISTENER
navigator.serviceWorker.addEventListener('message', function(event) {
  console.log('[app.js] Received message from service worker.' + event.data);
});

// Configure push subscription
function configurePush() {
    if (!('serviceWorker' in navigator)) {
      return; // do nothing
    }

    // Check for subscriptions
    var reg;
    navigator.serviceWorker.ready.then(function(serviceWorkerReg) {
      reg = serviceWorkerReg;
      return serviceWorkerReg.pushManager.getSubscription();
    }).then(function(sub) {
      if (sub === null) {
        // Create new subscription
        var vapidPublic = 'BPO-z8rUg0R6-7GR9oxQ0a-_MLW3KU1oCQztC4XlvTSyTEnz-Qk3_v9Tkc1MY0jYETdQE2Jz68WYWprfMOboYrc';
        var convertedVPub = urlBase64ToUint8Array(vapidPublic);

        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVPub
        });
      }
      else {
        // use existing
      }
    }).then(function(newSub) {
      return fetch('https://otonokizaka-3a6d9.firebaseio.com/subscriptions.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newSub)
      })
    }).then(function(ans) {
      if (ans.ok) {
          showConfirmNotification();
      }
    }).catch(function(ex) {
      console.log('[SW] Error creating subscription. ', ex);
    });
}

// Notification permission
function requestNotificationPermission() {
  console.log('[app.js] Notification permission requested.');
  Notification.requestPermission(function(choice) {
    console.log('[app.js] Notification permission: ', choice);
    if (choice !== 'granted') {
      console.log('[app.js] User disapproved request.');
    }
    else {
      console.log('[app.js] User approved request.');
      configurePush();
    }
  }); // ask for notification; if allowed, NOTIF + PUSH will be granted
}

// Display a confirmation notification
function showConfirmNotification() {
  // SERVICE WORKER-BASED NOTIFICATION
  if ('serviceWorker' in navigator) {
    var options = {
      body: "µ's will show notifications.",  // text body
      icon: '/src/images/icons/nozomi/app-icon-96x96.png', // icon
      image: '/src/images/mfs-image-small.jpg',  // image in notification body
      dir: 'ltr', // text direction
      lang: 'en-US', // language
      vibrate: [100, 100, 100], // vibration pattern (SUPPORTED IN SOME DEVICES)
      badge: '/src/images/icons/nozomi/app-icon-96x96.png',  // badge in notification bar
      tag: 'confirm-notification', // notification ID; no tags will spam notifs to user, otherwise stack
      renotify: true,  // assures that new notifs will still be active vibrate
      // Buttons displayed next to the notifications (MIGHT NOT BE DISPLAYED ON SOME DEVICES)
      actions: [
        { action: 'confirm', title: 'Okay', icon: '/src/images/icons/accept.png' },
        { action: 'cancel', title: 'Cancel', icon: '/src/images/icons/cancel.png' }
      ]
    };

    navigator.serviceWorker.ready.then(function(serviceWorkerReg) {
      serviceWorkerReg.showNotification('Subscription successful', options);
    });
  }

  // NON-SERVICE WORKER NOTIFICATION
  /*
  var options = {
    body: 'You have granted permission to show notifications.'
  };
  new Notification('Permission granted', options); // show notification
  */
}

// Enable notification listener if supported
if ('Notification' in window) {
  requestNotificationPermission();
}
