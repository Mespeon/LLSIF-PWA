// JS / JQ Code Sheet for Muse
// Coded by: Mark Nolledo

// JQUERY
// TOP BAR DISPLAY
$(document).scroll(function() {
  var y = $(this).scrollTop();
  if (y > 50) {
    $('#navbar--widescreens-transparent').slideUp(150, function() {
      $('#navbar--for-widescreens').slideDown(150);
    });
  }
  else {
    $('#navbar--for-widescreens').slideUp(150, function() {
      $('#navbar--widescreens-transparent').slideDown(150);
    });
  }
});

// DOM ELEMENTS
var drawerButtons = document.querySelectorAll('#navbar--drawer-switch');
var scrim = document.querySelector('#scrim');
var drawer = document.querySelector('#menu-drawer');
var viewportMeasure = document.querySelector('#viewport--current');

// VIEWPORT CALCULATOR
var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
viewportMeasure.textContent = 'Width: ' + w + ' Height: ' + h;


// REMOVE AFTER TESTING NATIVE DEVICE FEATURES
// REMOVE AFTER TESTING NATIVE DEVICE FEATURES

// SCROLL STOPPER
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  //window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    //window.ontouchmove = null;
    document.onkeydown = null;
}

/* DRAWER */
// Drawer events
for (s = 0; s < drawerButtons.length; s++) {
  drawerButtons[s].addEventListener('click', openDrawer);
}

// Drawer function
function openDrawer() {
  $(drawer).toggle('slide', 200);
  $(scrim).show();
  scrim.addEventListener('click', closeDrawer);
  disableScroll();
}

function closeDrawer() {
  $(drawer).toggle('slide', 200);
  $(scrim).hide();
  enableScroll();
  scrim.removeEventListener('click', closeDrawer);
}

/* FORM ANIMATIONS */
var addReactButton = document.querySelector('#addReact--trigger');
var cancelButton = document.querySelector('#react--cancel');
var commentField = document.querySelector('#addreact--container');
var nameField = document.querySelector('#name');  // all fields
var commentTextarea = document.querySelector('#comment-text');  // all textareas
var nameLabel = document.querySelector('#addreact--name-label');
var commentLabel = document.querySelector('#addreact--comment-label');

addReactButton.addEventListener('click', displayCommentSet);
cancelButton.addEventListener('click', hideCommentSet);

function displayCommentSet() {
  $(commentField).fadeIn(200);
  $(scrim).show();
  scrim.addEventListener('click', hideCommentSet);
}

function hideCommentSet() {
  $(scrim).hide();
  $(commentField).fadeOut(200);
  scrim.removeEventListener('click', hideCommentSet);
}

/* TOAST MESSAGES */
var testToast = document.querySelector('#gimmeToast');
var toastMessage = document.querySelector('#toast--message');
var dismissToastButton = document.querySelector('#toast--dismissal');
var freshToast = document.querySelector('#toast--container');
var toastDispose;

testToast.addEventListener('click', cookToast);

function cookToast() {
  toastMessage.textContent = 'Here, have a toast!';
  serveToast();
}

function timeoutToast() {
  toastDispose = setTimeout(function() { dismissToast() }, 5000);
}

function serveToast() {
  // Check if toast is visible
  // If yes, hide it first then recursive call function.
  // Else, show it immediately.
  if (freshToast.style.display !== 'none') {
    freshToast.style.display = 'none';
    clearTimeout(toastDispose);
    serveToast();
  }
  else {
    // USE ALTERNATE ANIMATIONS FOR NARROW AND WIDE VIEWPORTS.
    // USE THE VIEWPORT CALCULATOR TO DETERMINE WHICH ONE WILL BE USED.
    if (w > 480) {
      // Use default animation if viewport is greater than 480px (max for mobile views in CSS query)
      $(freshToast).fadeIn(200);
      timeoutToast();
    }
    else {
      // Use alternate animation if viewport is <= 480px
      $(freshToast).slideDown(200);
      timeoutToast();
    }
  }
}

// TRY INVOKING THIS ADDEVENTLISTENER DURING CREATION OF TOAST INSTEAD
// OF BEING CREATED ON PAGE LOAD.
dismissToastButton.addEventListener('click', dismissToast);

function dismissToast() {
  if (w > 480) {
    $(freshToast).fadeOut(200);
  }
  else {
    $(freshToast).slideUp(200);
  }
}
