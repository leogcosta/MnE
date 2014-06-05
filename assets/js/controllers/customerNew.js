var customerNewCtrl = app.controller('customerNewCtrl', ['$scope', '$location', '$http', 'dbEngine', function ($scope, $location, $http, dbEngine) {
  $scope.newCustomer = {
    customer_full_name: '',
    customer_phone_number: '',
    customer_email: ''
  };

  this.save = function () {
    /*
    dbEngine.save('customers', $scope.newCustomer, function (data, status, headers, config) {
      $location.path('/customers');
    });
    */
    dbEngine.update('customers', {customer_id: '55', customer_full_name: 'KILLER12', customer_email: 'moe.duffdude@gmail.com'}, function (data, status, headers, config) {
      console.log(data);
    });
  };

  $scope.customerNewCtrl = this;
}]);
