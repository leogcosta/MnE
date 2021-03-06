var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngTouch', 'dbEngine', 'syncEngine']);

app.controller('appCtrl', ['$rootScope', '$q', 'dbEngine2', 'syncEngine2', function ($rootScope, $q, dbEngine2, syncEngine2) {
  var promiseBroken = function (error) {
    console.error(error);
  };

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
      case 'customersCtrl':
      case 'customerEditCtrl':
      case 'customerNewCtrl':
      case 'depositsCtrl':
      case 'depositsNewCtrl':
      case 'depositsEditCtrl':
      case 'saleViaCustomerListCtrl':
      case 'saleViaCustomerNewCtrl':
      case 'saleViaCustomerEditCtrl':
        $('a[href="#/customers"]').addClass('active');
      break;

      case 'itemsCtrl':
      case 'itemEditCtrl':
      case 'itemNewCtrl':
        $('a[href="#/items"]').addClass('active');
      break;

      case 'accountsCtrl':
      case 'accountEditCtrl':
      case 'accountNewCtrl':
        $('a[href="#/accounts"]').addClass('active');
      break;

      case 'moreCtrl':
        $('a[href="#/more"]').addClass('active');
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
    // shit goes down once connection is reestablished son
    var sync = {
      keys: Object.keys(dbEngine2.webdb.sql),
      length: Object.keys(dbEngine2.webdb.sql).length,
      index: 0
    };

    var iSyncDeferred = $q.defer();

    var iSync = function () {
      syncEngine2.syncTable(sync.keys[sync.index], function (data) {
        if (++sync.index < sync.length) {
          iSync();
        } else if (sync.index === sync.length) {
          iSyncDeferred.resolve('sync completed');
        }
      });

      return iSyncDeferred.promise;
    };

    notify({message: 'syncing...'});
    dbEngine2.webdb.open().then(function (message) {
      dbEngine2.webdb.initiateTables().then(function (message) {
        iSync().then(function (msg) {
          notify({message: msg});
          // is anyone out there, this is John Connor
          // leader of the resistance
          $rootScope.$broadcast('SYNC');
          if ($rootScope.$$phase === null) {
            $rootScope.$apply();
          }
        }, promiseBroken);
      }, promiseBroken);
    }, promiseBroken);

    $rootScope.online = true;
    $rootScope.$apply();
  });

  Offline.on('down', function () {
    $rootScope.online = false;
    notify({message: 'you\'re now offline'});
    $rootScope.$apply();
  });
  //*/

  //$rootScope.online = false;

  $rootScope.syncMode = false;
  // promises that need to leave data on promise
  // need to do it here
  $rootScope.promiseData = {};

  console.log('Booting WebSQL...');
  dbEngine2.webdb.open().then(function (message) {
    console.log(message);

    dbEngine2.webdb.initiateTables().then(function (message) {
      console.log(message);
    }, function (error) {
      console.error(error);
    });
  }, function (error) {
    console.error(error);
  });
}]);

app.config(function ($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  }).

  when('/customers/new', {
    templateUrl: 'templates/customers/new.html',
    controller: 'customerNewCtrl'
  }).when('/customers/info/:id', {
    templateUrl: 'templates/customers/edit.html',
    controller: 'customerEditCtrl'
  }).when('/customers', {
    templateUrl: 'templates/customers/list.html',
    controller: 'customersCtrl',
    resolve: {
      loadSales: customersCtrl.loadSales,
      loadTransactions: customersCtrl.loadTransactions
    }
  }).

  when('/items/new', {
    templateUrl: 'templates/items/new.html',
    controller: 'itemNewCtrl'
  }).when('/items/info/:id', {
    templateUrl: 'templates/items/edit.html',
    controller: 'itemEditCtrl'
  }).when('/items', {
    templateUrl: 'templates/items/list.html',
    controller: 'itemsCtrl'
  }).

  when('/accounts/new', {
    templateUrl: 'templates/accounts/new.html',
    controller: 'accountNewCtrl'
  }).when('/accounts/info/:id', {
    templateUrl: 'templates/accounts/edit.html',
    controller: 'accountEditCtrl'
  }).when('/accounts', {
    templateUrl: 'templates/accounts/list.html',
    controller: 'accountsCtrl'
  }).


  // sales + deposit
  when('/customers/sales/:id', {
    templateUrl: 'templates/sales/viaCustomer/list.html',
    controller: 'saleViaCustomerListCtrl'
  }).when('/customers/sales/:id/new', {
    templateUrl: 'templates/sales/viaCustomer/new.html',
    controller: 'saleViaCustomerNewCtrl'
  }).when('/customers/sales/:customerId/edit/:saleId', {
    templateUrl: 'templates/sales/viaCustomer/edit.html',
    controller: 'saleViaCustomerEditCtrl'
  }).

  // deposits
  when('/customers/deposits/:customerId', {
    templateUrl: 'templates/deposits/list.html',
    controller: 'depositsCtrl'
  }).when('/customers/deposits/:customerId/new', {
    templateUrl: 'templates/deposits/new.html',
    controller: 'depositsNewCtrl'
  }).when('/customers/deposits/:customerId/edit/:depositId', {
    templateUrl: 'templates/deposits/edit.html',
    controller: 'depositsEditCtrl'
  }).

  when('/more', {
    templateUrl: 'templates/more.html',
    controller: 'moreCtrl'
  }).

  otherwise({
    redirectTo: '/login'
  });
});
