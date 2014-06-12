var customerNewCtrl = app.controller('customerNewCtrl', ['$scope', '$location', 'dbEngine', function ($scope, $location, dbEngine) {
  $scope.newCustomer = {
    customer_full_name: '',
    customer_phone_number: '',
    customer_email: ''
  };

  this.save = function () {
    dbEngine.save('customers', $scope.newCustomer, function (data, status, headers, config) {
      // someday we will leave in a world where we don't need $rootScope.$apply();
      // #believe #comingSoon #angularjsIsAwesome
      $location.path('/customers');

      if ($scope.$$phase === null) {
        $scope.$apply();
      }
    });
  };

  $scope.customerNewCtrl = this;
}]);
