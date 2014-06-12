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
      case 'customersCtrl':
      case 'customerNewCtrl':
        $('a[href="#/customers"]').addClass('active');
      break;

      case 'itemCtrl':
      case 'itemsCtrl':
      case 'itemNewCtrl':
        $('a[href="#/items"]').addClass('active');
      break;

      case 'accountCtrl':
      case 'accountsCtrl':
      case 'accountNewCtrl':
        $('a[href="#/accounts"]').addClass('active');
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

  ///*
  $rootScope.online = Offline.state === 'up' ? true : false;

  Offline.on('up', function () {
    $rootScope.online = true;
    syncEngine();
    $rootScope.$apply();
  });

  Offline.on('down', function () {
    $rootScope.online = false;
    notify({message: 'you\'re now offline'});
    $rootScope.$apply();
  });
  //*/

  //$rootScope.online = false;

  // i know i could have done a factory where it'll be shared among controllers
  // but am `experimenting` - so...let me be
  $rootScope.data = {
    customers: []
  };

  // bootWebSQL returns a promise
  // so latter on we can use .then to do a sequential execution - like
  // the good ol' days :)
  //dbEngine.bootWebSQL();
  dbEngine.setThat().then(function () {
    dbEngine.bootWebSQL();
  });
}]);

app.config(function ($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  }).

  when('/customers/new', {
    templateUrl: 'templates/customerNew.html',
    controller: 'customerNewCtrl'
  }).when('/customers/info/:id', {
    templateUrl: 'templates/customer.html',
    controller: 'customerCtrl'
  }).when('/customers', {
    templateUrl: 'templates/customers.html',
    controller: 'customersCtrl'
  }).

  when('/items/new', {
    templateUrl: 'templates/itemNew.html',
    controller: 'itemNewCtrl'
  }).when('/items/info/:id', {
    templateUrl: 'templates/item.html',
    controller: 'itemCtrl'
  }).when('/items', {
    templateUrl: 'templates/items.html',
    controller: 'itemsCtrl'
  }).

  when('/accounts/new', {
    templateUrl: 'templates/accountNew.html',
    controller: 'accountNewCtrl'
  }).when('/accounts/info/:id', {
    templateUrl: 'templates/account.html',
    controller: 'accountCtrl'
  }).when('/accounts', {
    templateUrl: 'templates/accounts.html',
    controller: 'accountsCtrl'
  }).

  otherwise({
    redirectTo: '/login'
  });
});
