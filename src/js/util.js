var dbPromise = idb.open('comments-store', 1, function(database) {
  if (!database.objectStoreNames.contains('comments')) {
      database.createObjectStore('comments', {keyPath: 'id'});
  }

  if (!database.objectStoreNames.contains('sync-comments')) {
      database.createObjectStore('sync-comments', {keyPath: 'id'});
  }
});

// WRITE ALL
function writeThis(storage, data) {
  return dbPromise.then(function(db) {
    var transact = db.transaction(storage, 'readwrite');
    var store = transact.objectStore(storage);
    store.put(data);  // SAVE DATA
    return transact.complete;
  });
}

// READ ALL
function readThis(storage) {
  return dbPromise.then(function(db) {
    var transact = db.transaction(storage, 'readonly');
    var store = transact.objectStore(storage);
    return store.getAll();  // RECEIVE AND RETURN DATA
  });
}

// CLEAR ALL
function clearThis(storage) {
  return dbPromise.then(function(db) {
    var transact = db.transaction(storage, 'readwrite');
    var store = transact.objectStore(storage);
    store.clear();
    return transact.complete; // RETURN THIS ON EVERY WRITE TRANSACTION
  });
}

// CLEAR ONE
function clearSpecific(storage, id) {
  dbPromise.then(function(db) {
    var transact = db.transaction(storage, 'readwrite');
    var store = transact.objectStore(storage);
    store.delete(id); // delete the indexedDB item with this ID
    return transact.compelete;
  }).then(function() {
    console.log('[util.js] Item from IndexedDB is deleted.');
  });
}

// CONVERTER from source
function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// BLOB CONVERTER from source
function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  var blob = new Blob([ab], {type: mimeString});
  return blob;
}
