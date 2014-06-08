var customersCtrl = app.controller('customersCtrl', ['$rootScope', '$scope', '$location', '$http', 'dbEngine', function ($rootScope, $scope, $location, $http, dbEngine) {
  $scope.customers = [];

  dbEngine.query('customers', function (data, status, headers, config) {;
    $scope.customers = data;

    if ($scope.$$phase === null) {
      $scope.$apply();
    }
  });

  // whenever 'sync-completed' is fired we're going to `reload` the current
  // listing, we're not going to be loading ERY where, just where it matters.
  // `more` code on our side, but worth it --- i think
  $scope.$on('sync-completed', function () {
    dbEngine.query('customers', function (data, status, headers, config) {;
      $scope.customers = data;

      if ($scope.$$phase === null) {
        $scope.$apply();
      }
    });
  });

  $scope.customersCtrl = this;
}]);
