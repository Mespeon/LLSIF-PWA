// DEFAULT OBJECTS
var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');

// LLSIF COMMENT OBJECTS
var commentsArea = document.querySelector('#comments-board');
var commentForm = document.querySelector('#comment');
var nameInput = document.querySelector('#name');
var commentInput = document.querySelector('#comment-text');

// NATIVE DEVICE (CAMERA)
var cameraViewport = document.querySelector('#player');
var cameraFilm = document.querySelector('#canvas');
var captureButton = document.querySelector('#capture-btn');
var feedButton = document.querySelector('#feed-btn');
var imagePicker = document.querySelector('#image-picker');
var controlsArea = document.querySelector('#videoplayer--camera-controls');
var pickerArea = document.querySelector('#pick-image');
var stopFeed = document.querySelector('#stop-feed');
var cameraNotice = document.querySelector('#videoplayer--notice');
var photo;

//var toastMessage = document.querySelector('#toast--message');

// CAMERA FEED
feedButton.addEventListener('click', initializeMedia);
stopFeed.addEventListener('click', stopMedia);

// INITIALIZE MEDIA ACCESS
function initializeMedia() {
  console.log('[feed.js] Initializing camera...');
  // FALLBACK IN CASE THE BROWSER OR DEVICE HAS NO ACCESS TO MEDIA DEVICES
  // FALLBACK POLYFILL
  if (!('mediaDevices' in navigator)) {
    navigator.mediaDevices = {};
  }

  if (!('getUserMedia' in navigator.mediaDevices)) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      if (!getUserMedia) {
        return Promise.reject(new Error('[feed.js] getUserMedia is not supported by this browser.'));
      }

      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }

  // ACCESS CAMERA FEED
  navigator.mediaDevices.getUserMedia({video: true}).then(function(stream) {
    console.log('[feed.js] Accessing camera. Feed should appear now.');
    cameraViewport.srcObject = stream;
    stopFeed.style.display = 'inline';
    feedButton.style.display = 'none';
    cameraViewport.style.display = 'block';
    captureButton.style.display = 'inline';
    cameraNotice.textContent = 'Access to camera is allowed.';
  }).catch(function(ex) {
    console.log('[feed.js] An error has occurred while accessing the camera.', ex);
    controlsArea.style.display = 'none';
    pickerArea.style.display = 'block';
    cameraNotice.textContent = 'Access to camera is denied.';
  });
}

// CAPTURE PHOTO
captureButton.addEventListener('click', function(event) {
  cameraFilm.style.display = 'block';
  cameraViewport.style.display = 'none';
  controlsArea.style.display = 'none';
  cameraNotice.textContent = 'Image captured.';

  // TAKE THE SHOT
  var snapshot = cameraFilm.getContext('2d');
  snapshot.drawImage(cameraViewport, 0, 0, cameraFilm.width, cameraViewport.videoHeight / (cameraViewport.videoWidth / cameraFilm.width));
  // / (cameraViewport.videoWidth / cameraFilm.width)
  // Stop camera feed
  cameraViewport.srcObject.getVideoTracks().forEach(function(track) {
    track.stop();
  });
  photo = dataURItoBlob(cameraFilm.toDataURL());
});

// MANUAL UPLOAD LISTENER
imagePicker.addEventListener('change', function(event) {
  photo = event.target.files[0];
});

// Stop camera feed
function stopMedia() {
  cameraViewport.srcObject.getVideoTracks().forEach(function(track) {
    track.stop();
  });
  feedButton.style.display = 'block';
  stopFeed.style.display = 'none';
  cameraViewport.style.display = 'none';
  cameraFilm.style.display = 'none';
  captureButton.style.display = 'none';
  cameraNotice.textContent = 'Camera stopped.';
}

// DIRECT SEND TO BACKEND FOR NON-SYNC SUPPORTING BROWSERS
function sendNow() {
  console.log('[feed.js] Sending data directly...');
  // APPEND FORM DATA AS KEY PAIRS
  var postID = new Date().toISOString();
  var commentData = new FormData();
  commentData.append('id', postID);
  commentData.append('avatar', photo, postID + '.png');
  commentData.append('timestamp', postID);
  commentData.append('user', nameInput.value);
  commentData.append('txt', commentInput.value);

  console.log('[feed.js] Logged data from commentData FormData():');
  console.log("ID: " + postID + " " + commentData.get('id'));
  console.log("Avatar File: " + photo + " " + commentData.get('avatar'));
  console.log("Timestamp: " + postID + " " + commentData.get('timestamp'));
  console.log("User: " + nameInput.value + " " + commentData.get('user'));
  console.log("Comment Text: " + commentInput.value + " " + commentData.get('txt'));

  fetch('https://us-central1-otonokizaka-3a6d9.cloudfunctions.net/storeCommentData', {
    method: 'POST',
    body: commentData
    /*
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },*/
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
    console.log('[feed.js] Data directly sent.', response);
    toastMessage.textContent = 'Your comment was sent directly.';
    serveToast();
    //updateComments();
  }).catch(function(ex) {
    console.log('[feed.js] Direct send failed. ', ex);
    toastMessage.textContent = 'Failed to upload comment.';
    serveToast();
  });
}

// SUBMIT LISTENER
commentForm.addEventListener('submit', function(event) {
  event.preventDefault();
  console.log('[feed.js] Submit button was clicked.');
  toastMessage.textContent = 'Processing request.';
  serveToast();

  // Check if fields are empty.
  // MAY NOT BE NEEDED DUE TO THE FIELDS' REQUIRED ATTRIB
  if (nameInput.value.trim() === '' || commentInput.value.trim() === '') {
    alert('All fields are required.');
    return; // ignore button click
  }

  // CLOSE POST WINDOW HERE
  hideCommentSet();

  // Checks for browser support
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(function(worker) {
      // Sample post
      var post = {
        // FOLLOW STRUCTURE FORMAT IN FIREBASE
        id: new Date().toISOString(),
        //avatar: 'https://firebasestorage.googleapis.com/v0/b/otonokizaka-3a6d9.appspot.com/o/default.jpg?alt=media&token=b8736d57-e915-41f4-8f68-9ace1496c45e',
        avatar: photo,
        timestamp: new Date().toISOString(),
        user: nameInput.value,
        txt: commentInput.value
      };

      // Save to IndexedDB
      writeThis('sync-comments', post).then(function() {
        // Register sync worker then log it
        worker.sync.register('llsif-sync-comment');
        console.log('[feed.js] Sync task registered.');
      }).then(function() {
        // PROVIDE A NEW TOAST/NOTIF OBJECT LATER
        console.log('[feed.js] Post saved for later sync.');
        toastMessage.textContent = 'Your comment was saved for uploading.';
        serveToast();
      }).catch(function(ex) {
        console.log('[feed.js] Error has occurred: ', ex);
        toastMessage.textContent = 'An error has occurred.';
        serveToast();
      });
    });
  }
  else {
    toastMessage.textContent = 'Background sync did not work. Sending your comment now.';
    serveToast();
    sendNow();
  }
});

// Clear comments before appending updated ones
function clearCommentsArea() {
  console.log('[feed.js] Clearing comments...');
  while(commentsArea.hasChildNodes()) {
    console.log('[feed.js] Cleared child node.');
    commentsArea.removeChild(commentsArea.lastChild); // removes last comment posted
  }
}

// COMMENT CREATOR FOR FIREBASE DATA
function createComment(data) {
  var postParentWrapper = document.createElement('div');  // parent wrapper
  postParentWrapper.className = 'comment-post';
  var commentHeaderWrapper = document.createElement('div'); // header wrapper
  commentHeaderWrapper.className = 'comment-user-heading';
  postParentWrapper.appendChild(commentHeaderWrapper);
  var headerPhotoContainer = document.createElement('div'); // photo container
  headerPhotoContainer.className = 'user-photo-container';
  commentHeaderWrapper.appendChild(headerPhotoContainer);
  var headerPhoto = document.createElement('img');  // photo
  headerPhoto.className = 'user-photo';
  // TEST CONDITION FOR USING A DEFAULT IMAGE
  /*
  if (data.avatar) {
    headerPhoto.src = data.avatar;
  }
  else {
    headerPhoto.src = '';
  } */
  headerPhoto.src = data.avatar;
  //headerPhoto.src = '/src/images/muse-umi.jpg'; // headerPhoto.src = data.image (WHERE image IS THE COLUMN IN FIREBASE)
  headerPhoto.alt = 'user';
  headerPhotoContainer.appendChild(headerPhoto);
  var headerNameContainer = document.createElement('div');  // name container
  headerNameContainer.className = 'user-name-container';
  commentHeaderWrapper.appendChild(headerNameContainer);
  var userLink = document.createElement('a'); // name link
  userLink.className = 'user-link';
  userLink.textContent = data.user;
  //userLink.textContent = 'Sonoda Umi';  // userLink.textContent = data.title (WHERE title IS COLUMN IN FIREBASE)
  userLink.href = '#';
  headerNameContainer.appendChild(userLink);
  var timestamp = document.createElement('span'); // timestamp
  timestamp.className = 'timestamp';
  //timestamp.textContent = '7/5/2018 1:23PM';
  timestamp.textContent = data.timestamp;
  headerNameContainer.appendChild(timestamp);
  var commentBodyWrapper = document.createElement('div'); // comment body wrapper
  commentBodyWrapper.className = 'comment-body';
  postParentWrapper.appendChild(commentBodyWrapper);
  var commentParagraph = document.createElement('p'); // comment body
  commentParagraph.className = 'comment-paragraph';
  //commentParagraph.textContent = "This is a dynamically added comment. If you could read this comment, the content and related scripts have been cached. If the static comment above this is not visible, then the clearCommentArea() function successfully cleared it.";
  commentParagraph.textContent = data.txt;
  commentBodyWrapper.appendChild(commentParagraph);
  // FOR USER REQUESTED CACHING - remove once done
  /* var saveButton = document.createElement('button');
  saveButton.textContent = 'Save this comment';
  saveButton.addEventListener('click', onSaveClick);
  commentBodyWrapper.appendChild(saveButton); */

  commentsArea.appendChild(postParentWrapper);
}

// Helper for updating UI based on contents from Firebase
function updateComments(data) {
  clearCommentsArea();
  console.log('[feed.js] Updating comments area...');
  for (var a = 0; a < data.length; a++) {
    createComment(data[a]);
  }
}

/*
// Helper for updating UI, but in reverse (CHRONOLOGICAL ORDER i.e. from latest addition)
function updateComments(data) {
  clearCommentsArea();
  for (var position = data.length - 1; position >= 0; position--) {
    createComment(data[position]);
  }
}
*/

// CACHE THEN NETWORK STRATEGY
//var source_url = 'https://httpbin.org/get'; // for GET requests
//  var source_url = 'https://httpbin.org/post';  // for POST requests
// REVERT SHALLOW REQUEST URL TO FALSE TO FETCH FULL CONTENTS
// THIS IS DONE SO THAT THE CACHE AND NETWORK IS NOT OVERLOADED WITH DATA
// DURING TESTING.
var source_url = 'https://otonokizaka-3a6d9.firebaseio.com/comments.json';
var networkData = false;

// GET request from Firebase
fetch(source_url).then(function(reply) {
  return reply.json();
}).then(function(data) {
  networkData = true;
  console.log('[feed.js] Received from web: ', data);
  // CONVERT FIREBASE DATA OBJECT TO ARRAY
  var firebaseData = [];
  for (var key in data) {
    firebaseData.push(data[key]);
  }
  updateComments(firebaseData);
}).catch(function(ex) {
  console.log('[feed.js]: Error occured: ', ex);
  setTimeout(function() {
    toastMessage.textContent = 'Cannot retrieve comments right now.';
    serveToast();
  }, 5000);
});

// Fetch from cache FOR FIREBASE
/*  RESTORE IF ACCESSING CACHE FOR RESPONSES
if ('caches' in window) {
  caches.match(source_url)
  .then(function(rep) {
    if (rep) {
      return rep.json();
    }
  })
  .then(function(cacheData) {
    console.log('Retrieved from cache: ', cacheData);
    if (!networkData) {
        // CONVERT FIREBASE DATA OBJECT TO ARRAY
        var firebaseData = [];
        for (var key in cacheData) {
          firebaseData.push(cacheData[key]);
        }
        updateComments(firebaseData)
    }
  });
}
*/

// Fetch from IndexedDB
if ('indexedDB' in window) {
  readThis('comments').then(function(data) {
    if (!networkData) {
      console.log('[feed.js] Retrieved from cache (IndexedDB):', data);
      updateComments(data);
    }
  });
}
