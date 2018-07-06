var deferPrompt;

if (!window.Promise) {
  window.Promise = Promise;
}

// Check service worker availability in browser
if ('serviceWorker' in navigator){
  // Register service worker
  navigator.serviceWorker.register('/sw.js')
  .then(function() {
    console.log('Service worker is registered.');
  }).catch(function(error) {
    console.log(error.code, error.message);
  });
}

// Banner event reaction
// Prevents immediate display of PWA installation banner
/*
window.addEventListener('beforeinstallprompt', function(event){
  console.log('Install prompt fired...');
  event.preventDefault();
  deferPrompt = event;
  return false;
});
*/

// PROMISE
/*
var promise = new Promise(function(resolve, reject) {
  setTimeout(function() {
    //resolve('Executed once done.');
    reject({code: 500, message: 'An error occurred.'});
    //console.log('Executed once done.');
  }, 3000);
});

promise.then(function(text) {
  return text;
}).then(function(newText) {
  console.log(newText);
}).catch(function(error) {
  console.log(error.code, error.message);
});

// then = try
// catch = catch

console.log('Executed after 3 seconds');


// FETCH
fetch('http://httpbin.org/ip').then(function(response) {
  console.log(response);
  return response.json(); // used for returning/parsing the data within the fetch response
}).then(function(data) {
  console.log(data);
}).catch(function(error) {
  console.log(error.code, error.message);
});

fetch('http://httpbin.org/post', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  mode: 'cors',
  body: JSON.stringify({message: 'Does this work?'})
}).then(function(response) {
  console.log(response);
  return response.json(); // used for returning/parsing the data within the fetch response
}).then(function(data) {
  console.log(data);
}).catch(function(error) {
  console.log(error.code, error.message);
});
*/
