var customerNewCtrl = app.controller('customerNewCtrl', ['$rootScope', '$scope', '$location', '$http', 'dbEngine', function ($rootScope, $scope, $location, $http, dbEngine) {
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

  /*
  dbEngine.delete('customers', 'customer_id', 14, function (data, status, headers, config) {
    console.log(data);
  });
  */

  /*
  dbEngine.update('customers', {customer_id: 1, customer_full_name: 'We Come ONE!', customer_phone_number: '0912441676', customer_email: 'moe.duffdude@gmail.com'}, function (data, status, headers, config) {
    console.log(data);
  });
  */

  /*
  dbEngine.query('customers', function (data, status, headers, config) {
    console.log(data);
  });
  */

  /*
  dbEngine.get('customers', 99, function (data, status, headers, config) {
    console.log(data);
  });
  */

  $scope.customerNewCtrl = this;
}]);
