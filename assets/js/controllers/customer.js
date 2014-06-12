var customerCtrl = app.controller('customerCtrl', ['$scope', '$location', '$routeParams', 'dbEngine', function ($scope, $location, $routeParams, dbEngine) {
  dbEngine.get('customers', $routeParams.id, function (data, status, headers, config) {
    $scope.customer = data;

    if ($scope.$$phase === null) {
      $scope.$apply();
    }
  });

  this.update = function () {
    dbEngine.update('customers', $scope.customer, function (data, status, headers, config) {
      $scope.customer = data;

      if ($scope.$$phase === null) {
        $scope.$apply();
      }
    });
  };

  this.delete = function () {
    dbEngine.delete('customers', 'customer_id', $scope.customer.customer_id, function (data, status, headers, config) {
      $location.path('/customers');

      if ($scope.$$phase === null) {
        $scope.$apply();
      }
    });
  };

  $scope.customerCtrl = this;
}]);
