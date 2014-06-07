var customersCtrl = app.controller('customersCtrl', ['$rootScope', '$scope', '$location', '$http', 'dbEngine', function ($rootScope, $scope, $location, $http, dbEngine) {
  $scope.customers = [];

  dbEngine.query('customers', function (data, status, headers, config) {;
    $scope.customers = data;

    if ($scope.$$phase === null) {
      $scope.$apply();
    }
  });

  $scope.customersCtrl = this;
}]);
