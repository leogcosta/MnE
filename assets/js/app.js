var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngTouch', 'dbEngine']);

app.controller('appCtrl', ['$rootScope', '$http', 'dbEngine', function ($rootScope, $http, dbEngine) {
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
        $('a[href="#/customer"]').addClass('active');
      break;
    }
  });

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

  $rootScope.message = '';
}]);

app.config(function ($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  }).when('/customer', {
    templateUrl: 'templates/customer.html',
    controller: 'customerCtrl'
  }).when('/customer/new', {
    templateUrl: 'templates/customerNew.html',
    controller: 'customerNewCtrl'
  }).otherwise({
    redirectTo: '/login'
  });
});
