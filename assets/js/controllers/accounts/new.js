var accountNewCtrl = app.controller('accountNewCtrl', ['$scope', '$location', 'dbEngine', function ($scope, $location, dbEngine) {
  $scope.newAccount = {
    account_name: ''
  };

  this.save = function () {
    dbEngine.save('accounts', $scope.newAccount, function (data, status, headers, config) {
      $location.path('/accounts');

      if ($scope.$$phase === null) {
        $scope.$apply();
      }
    });
  };

  $scope.accountNewCtrl = this;
}]);
