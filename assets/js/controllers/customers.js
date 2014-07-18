var customersCtrl = app.controller('customersCtrl',
                                   ['$rootScope', '$scope', '$q', 'dbEngine2', 'syncEngine2',
                                   function ($rootScope, $scope, $q, dbEngine2, syncEngine2) {

  var promiseData = angular.copy($rootScope.promiseData);

  dbEngine2.query('customers', function (data) {
    // coping the data is a cool thing to do else the referenced OBJECT
    // will cause havoc in the redecoration process which is run behind the
    // `scene` --- for performance reasons
    $scope.customers = angular.copy(data);

    for (customer in $scope.customers) {
      var totalOwe = 0;

      for (sale in promiseData.sales) {
        if ($scope.customers[customer].customer_id === promiseData.sales[sale].sale_customer_customer_id) {
          totalOwe += (promiseData.sales[sale].sale_item_quantity * promiseData.sales[sale].sale_item_unit_price);
        }
      }

      for (transaction in promiseData.transactions) {
        if ($scope.customers[customer].customer_id === promiseData.transactions[transaction].trasaction_customer_customer_id && promiseData.transactions[transaction].transaction_type === 'CUSTOMER-DEPOSIT') {
          totalOwe -= promiseData.transactions[transaction].transaction_amount;
        }
      }

      $scope.customers[customer].totalOwe = totalOwe;
    }

    if ($rootScope.$$phase === null) {
      $rootScope.$apply();
    }
  });
}]);


customersCtrl.loadSales = function ($rootScope, $q, dbEngine2) {
  var deferred = $q.defer();

  dbEngine2.query('sales', function(data) {
    $rootScope.promiseData.sales = angular.copy(data);
    deferred.resolve();
  });

  return deferred.promise;
};


customersCtrl.loadTransactions = function ($rootScope, $q, dbEngine2) {
  var deferred = $q.defer();

  dbEngine2.query('transactions', function(data) {
    $rootScope.promiseData.transactions = angular.copy(data);
    deferred.resolve();
  });

  return deferred.promise;
};



var customerNewCtrl = app.controller('customerNewCtrl',
                                     ['$rootScope', '$scope', '$location', 'dbEngine2',
                                     function ($rootScope, $scope, $location, dbEngine2) {
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



var customerEditCtrl = app.controller('customerEditCtrl',
                                      ['$rootScope', '$scope', '$routeParams', '$location', 'dbEngine2',
                                      function ($rootScope, $scope, $routeParams, $location, dbEngine2) {
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
