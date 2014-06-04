var customerNewCtrl = app.controller('customerNewCtrl', ['$scope', '$location', '$http', 'dbEngine', function ($scope, $location, $http, dbEngine) {
  $scope.newCustomer = {
    customer_full_name: '',
    customer_phone_number: '',
    customer_email: ''
  };

  this.save = function () {
    dbEngine.save('customers', $scope.newCustomer, function (data) {
      console.log(data);
    });
  };

  $scope.customerNewCtrl = this;
}]);
