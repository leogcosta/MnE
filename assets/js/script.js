// reducing our global foot print to a single variable
var GLOBAL = {
  notifyTimer: null,
  appCache: null
};



// we are ready to roll
$(document).ready(function () {
  GLOBAL.appCache = window.applicationCache;
  GLOBAL.appCache.addEventListener('updateready', function () {
    GLOBAL.appCache.swapCache();
    if (confirm('App update is available. Update now?')) {
      window.location.reload();
    }
  }, false);

  $('.notification-bar').on('click', function () {
    clearTimeout(GLOBAL.notifyTimer);
    $('.notification-bar').animate({
      'height': '0'
    }, 300);
  });
});



// notification
// basically sets a height to 24px - what am i saying --- it exactly does that
function notify (option) {
  clearTimeout(GLOBAL.notifyTimer);
  $('.notification-bar').animate({
    'height': '0'
  }, 300, function () {
    $('.notification-bar > p').html(option.message);
    $('.notification-bar').animate({
      'height': '24'
    }, 300);
  });

  GLOBAL.notifyTimer = setTimeout(function () {
    $('.notification-bar').animate({
      'height': '0'
    }, 300);
  }, 5000);
}
