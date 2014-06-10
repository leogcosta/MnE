var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngTouch', 'dbEngine', 'syncEngine']);

app.controller('appCtrl', ['$rootScope', '$q', '$http', 'dbEngine', 'syncEngine', function ($rootScope, $q, $http, dbEngine, syncEngine) {
  $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
    console.log(rejection);
  });

  $rootScope.$on('$routeChangeStart', function (event, target) {
  });

  $rootScope.$on('$routeChangeSuccess', function (event, target) {
    // we're going to be using controllers names as reference of where we are
    // and according to `that` we're going to do stuff...
    target.controller === 'loginCtrl' ? $('.menu').addClass('hide') : $('.menu').removeClass('hide');
    $('.menu > a').removeClass('active');

    switch(target.controller) {
      case 'customerCtrl':
      case 'customerNewCtrl':
      case 'customersCtrl':
        $('a[href="#/customers"]').addClass('active');
      break;
    }

    // when navigating from a scrolled position, the next view will take
    // the `further` bottom of the next page --- it's really hard to explain
    // the `bug`
    //
    // i just have to scroll to the top ERY time - that's it! - geez!
    $('html, body').animate({
      scrollTop: 0
    }, 500, 'easeOutExpo');
  });

  /*
  $rootScope.online = Offline.state === 'up' ? true : false;

  Offline.on('up', function () {
    $rootScope.online = true;
    $rootScope.$apply();
    // we should be syncing here...
  });

  Offline.on('down', function () {
    $rootScope.online = false;
    $rootScope.$apply();
  });
  */

  $rootScope.online = false;

  dbEngine.bootWebSQL();
}]);

app.config(function ($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  }).when('/customers', {
    templateUrl: 'templates/customers.html',
    controller: 'customersCtrl'
  }).when('/customers/new', {
    templateUrl: 'templates/customerNew.html',
    controller: 'customerNewCtrl'
  }).otherwise({
    redirectTo: '/login'
  });
});
