var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');
var commentsArea = document.querySelector('#comments-board');

function openCommentFields() {

}

// Ondemand cache save
/*
function onSaveClick(event) {
  console.log('Save is clicked.');
  if ('caches' in window) {
    caches.open('llsifusercache').then(function(cache) {
      cache.addAll([
        'https://httpbin.org/get',
        '/src/images/muse-umi.jpg',
      ]);
    });
  }
}
*/

// Clear comments before appending updated ones
function clearCommentsArea() {
  while(commentsArea.hasChildNodes()) {
    commentsArea.removeChild(commentsArea.lastChild); // removes last comment posted
  }
}

// Demo create comment with sample content
function createComment() {
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
  headerPhoto.src = '/src/images/muse-umi.jpg';
  headerPhoto.alt = 'user';
  headerPhotoContainer.appendChild(headerPhoto);
  var headerNameContainer = document.createElement('div');  // name container
  headerNameContainer.className = 'user-name-container';
  commentHeaderWrapper.appendChild(headerNameContainer);
  var userLink = document.createElement('a'); // name link
  userLink.className = 'user-link';
  userLink.textContent = 'Sonoda Umi';
  userLink.href = '#';
  headerNameContainer.appendChild(userLink);
  var timestamp = document.createElement('span'); // timestamp
  timestamp.className = 'timestamp';
  timestamp.textContent = '7/5/2018 1:23PM';
  headerNameContainer.appendChild(timestamp);
  var commentBodyWrapper = document.createElement('div'); // comment body wrapper
  commentBodyWrapper.className = 'comment-body';
  postParentWrapper.appendChild(commentBodyWrapper);
  var commentParagraph = document.createElement('p'); // comment body
  commentParagraph.className = 'comment-paragraph';
  commentParagraph.textContent = "This is a dynamically added comment. If you could read this comment, the content and related scripts have been cached. If the static comment above this is not visible, then the clearCommentArea() function successfully cleared it.";
  commentBodyWrapper.appendChild(commentParagraph);
  // FOR USER REQUESTED CACHING - remove once done
  /* var saveButton = document.createElement('button');
  saveButton.textContent = 'Save this comment';
  saveButton.addEventListener('click', onSaveClick);
  commentBodyWrapper.appendChild(saveButton); */

  commentsArea.appendChild(postParentWrapper);
}

// CACHE THEN NETWORK STRATEGY
var source_url = 'https://httpbin.org/get';
var networkData = false;

// POST TO WEB (Post)
/*
fetch(source_url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({ message: 'Some message'})
})
*/

// Fetch from web (GET)
fetch(source_url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    networkData = true;
    console.log('From web: ', data);
    clearCommentsArea();
    createComment();
  }).catch(function(ex) {
    console.log('Error: ', ex);
  });

// Fetch from cache
if ('caches' in window) {
  caches.match(source_url)
  .then(function(rep) {
    if (rep) {
      rep.json();
    }
  })
  .then(function(data) {
    console.log('From cache: ', data);
    if (!networkData) {
        clearCommentsArea();
        createComment();
    }
  })
}

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  /*
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  }
  */
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

//shareImageButton.addEventListener('click', openCreatePostModal);

//closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

/* Create card for news feed
function createCard() {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url("/src/images/muse-group-2.jpg")';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.style.color = 'white';
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = 'Love Live!';
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = 'Meeting the members!';
  cardSupportingText.style.textAlign = 'center';
  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}
*/
/*
fetch('https://httpbin.org/get')
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    createCard();
  });
*/
