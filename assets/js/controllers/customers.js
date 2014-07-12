var customersCtrl = app.controller('customersCtrl', ['$rootScope', '$scope', '$q', 'dbEngine2', 'syncEngine2', function ($rootScope, $scope, $q, dbEngine2, syncEngine2) {
  dbEngine2.query('customers', function (data) {
    $scope.customers = data;

    if ($rootScope.$$phase === null) {
      $rootScope.$apply();
    }
  });
}]);



var customerNewCtrl = app.controller('customerNewCtrl', ['$rootScope', '$scope', '$location', 'dbEngine2', function ($rootScope, $scope, $location, dbEngine2) {
  $scope.instance = {
    customer_full_name: '',
    customer_phone_number: '',
    customer_email: '',
    customer_timestamp: ''
  };

  this.save = function () {
    dbEngine2.save('customers', $scope.instance, function (data) {
      $location.path('/customers');

      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  };

  $scope.saveCtrl = this;
}]);



var customerEditCtrl = app.controller('customerEditCtrl', ['$rootScope', '$scope', '$routeParams', '$location', 'dbEngine2', function ($rootScope, $scope, $routeParams, $location, dbEngine2) {
  $scope.edit = {};

  dbEngine2.get('customers', $routeParams.id, function (data) {
    $scope.edit = data;

    if ($rootScope.$$phase === null) {
      $rootScope.$apply();
    }
  });

  this.update = function () {
    dbEngine2.update('customers', $scope.edit, function (data) {
      $scope.edit = data;

      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  };

  this.delete = function () {
    dbEngine2.delete('customers', $scope.edit, function (data) {
      $location.path('/customers');

      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  };

  $scope.editCtrl = this;
}]);
