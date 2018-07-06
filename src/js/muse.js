// JS / JQ Code Sheet for Muse
// Coded by: Mark Nolledo

// UNREGISTRATION FOR SERVICE WORKER
/*
function removeServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
    .then(function(registrations) {
      for (var s = 0; s < registrations.length; s++) {
        registrations[s].unregister();
        console.log('Service worker unregistered.')
      }
    })
  }
}
*/

function redirectToMembers(callingObject) {
  var url = null;
  /*
  if (callingObject === 'members-muse') {
    url = "/members/members.html";
    location.href = url;
  }
  else if (callingObject === 'aqours-mode') {
    url = 'aqours.html';
    location.href = url;
  }
  else if (callingObject === 'llsif-learn-more') {
    url = "llsif.html";
    location.href = url;
  }
  */

  switch (callingObject) {
    case "llsif-learn-more":
      url = 'http://decaf.kouhi.me/lovelive/';
      location.href = url;
      break;

    case "honoka":
      url = "/members/kousaka_honoka.html";
      location.href = url;
      break;

    case "umi":
      url = "/members/sonoda_umi.html";
      location.href = url;
      break;

    case "kotori":
      url = "/members/minami_kotori.html";
      location.href = url;
      break;

    case "rin":
      url = "/members/hoshizora_rin.html";
      location.href = url;
      break;

    case "hanayo":
      url = "/members/koizumi_hanayo.html";
      location.href = url;
      break;

    case "maki":
      url = "/members/nishikino_maki.html";
      location.href = url;
      break;

    case "nico":
      url = "/members/yazawa_nico.html";
      location.href = url;
      break;

    case "eli":
      url = "/members/ayase_eli.html";
      location.href = url;
      break;

    case "nozomi":
      url = "/members/toujou_nozomi.html";
      location.href = url;
      break;

    default:
      url = "/";
      location.href = url;
  }
}

// JQUERY
// TOP BAR DISPLAY
$(document).scroll(function() {
  var y = $(this).scrollTop();
  if (y > 250) {
    $('#top-bar').fadeIn();
  }
  else {
    $('#top-bar').fadeOut();
  }
});

$('#commentTrigger').click(function(e) {
  $('#lightbox-shadow').fadeIn(300);
});

/*
$('#lightbox-shadow').click(function(e) {
  $(this).fadeOut(300);
});
*/

$('#cancel').click(function(e) {
  $('#lightbox-shadow').fadeOut(300);
});
