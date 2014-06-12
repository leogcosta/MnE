var accountCtrl = app.controller('accountCtrl', ['$scope', '$location', '$routeParams', 'dbEngine', function ($scope, $location, $routeParams, dbEngine) {
  dbEngine.get('accounts', $routeParams.id, function (data, status, headers, config) {
    $scope.account = data;

    if ($scope.$$phase === null) {
      $scope.$apply();
    }
  });

  this.update = function () {
    dbEngine.update('accounts', $scope.account, function (data, status, headers, config) {
      $scope.account = data;

      if ($scope.$$phase === null) {
        $scope.$apply();
      }
    });
  };

  this.delete = function () {
    dbEngine.delete('accounts', 'account_id', $scope.account.account_id, function (data, status, headers, config) {
      $location.path('/accounts');

      if ($scope.$$phase === null) {
        $scope.$apply();
      }
    });
  };

  $scope.accountCtrl = this;
}]);
