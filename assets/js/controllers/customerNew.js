var customerNewCtrl = app.controller('customerNewCtrl', ['$rootScope', '$scope', '$location', '$http', 'dbEngine', function ($rootScope, $scope, $location, $http, dbEngine) {
  $scope.newCustomer = {
    customer_full_name: '',
    customer_phone_number: '',
    customer_email: ''
  };

  this.save = function () {
    dbEngine.save('customers', $scope.newCustomer, function (data, status, headers, config) {
      $location.path('/customers');
    });
  };

  $scope.customerNewCtrl = this;
}]);
