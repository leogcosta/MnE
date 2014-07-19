var depositsCtrl = app.controller('depositsCtrl',
                               ['$rootScope', '$scope', '$routeParams', 'dbEngine2',
                               function ($rootScope, $scope, $routeParams, dbEngine2) {

  $scope.customerId = Number($routeParams.customerId);
  $scope.transactions = [];

  dbEngine2.query('transactions', function (data) {
    data = angular.copy(data);

    for (index in data) {
      if (data[index].transaction_type === 'CUSTOMER-DEPOSIT' && data[index].trasaction_customer_customer_id === $scope.customerId) {
        data[index].moment = {
          age: moment(data[index].transaction_timestamp, 'YYYY-MM-DD HH:mm:ss').fromNow(),
          time: moment(data[index].transaction_timestamp, 'YYYY-MM-DD HH:mm:ss').format('hh:mm A'),
          month: moment(data[index].transaction_timestamp, 'YYYY-MM-DD HH:mm:ss').format('MMMM'),
          year: moment(data[index].transaction_timestamp, 'YYYY-MM-DD HH:mm:ss').format('YYYY')
        };

        $scope.transactions.push(data[index]);
      }
    }

    if ($rootScope.$$phase === null) {
      $rootScope.$apply();
    }
  });
}]);



var depositsNewCtrl = app.controller('depositsNewCtrl',
                                 ['$rootScope', '$scope', '$location', '$routeParams', 'dbEngine2',
                                 function ($rootScope, $scope, $location, $routeParams, dbEngine2) {

  $scope.customerId = Number($routeParams.customerId);
  $scope.totalOwe = 0;
  var totalOweCopy = 0;
  // amount deposited will be automatically deposited to the current users
  // `hold-account`
  $scope.instance = {
    transaction_type: 'CUSTOMER-DEPOSIT',
    transaction_amount: '',
    transaction_hold: '',
    transaction_transfer: '',
    transaction_description: '',
    transaction_timestamp: '',
    transaction_account_account_id: '',
    trasaction_customer_customer_id: $scope.customerId,
    transaction_user_user_id: '',
    trasaction_sale_sale_id: '',
    transaction_account_from_account_id: ''
  };

  $scope.computeTotalRemainder = function () {
    if (isNaN($scope.instance.transaction_amount) === false) {
      $scope.totalOwe = totalOweCopy - $scope.instance.transaction_amount;
    } else {
      $scope.totalOwe = totalOweCopy;
    }
  };

  dbEngine2.query('sales', function (data) {
    for (index in data) {
      if (data[index].sale_customer_customer_id === $scope.customerId) {
        $scope.totalOwe += (data[index].sale_item_unit_price * data[index].sale_item_quantity);
      }
    }

    // and then we look through transactions the customer made
    dbEngine2.query('transactions', function (data) {
      for (index in data) {
        if (data[index].trasaction_customer_customer_id === $scope.customerId) {
          $scope.totalOwe -= data[index].transaction_amount;
        }
      }

      totalOweCopy = angular.copy($scope.totalOwe);
      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  });

  this.save = function () {
    // we're automatically pushing the whole thing to user's hold `account`
    $scope.instance.transaction_hold = $scope.instance.transaction_amount;
    dbEngine2.save('transactions', $scope.instance, function (data) {
      $location.path('customers/deposits/'+ $scope.customerId);

      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  };

  $scope.depositsNewCtrl = this;
}]);



var depositsEditCtrl = app.controller('depositsEditCtrl',
                                      ['$rootScope', '$scope', '$routeParams', '$location', 'dbEngine2',
                                      function ($rootScope, $scope, $routeParams, $location, dbEngine2) {

  $scope.customerId = Number($routeParams.customerId);
  $scope.transactionId = Number($routeParams.depositId);
  $scope.totalOwe = 0;
  var totalOweCopy = 0;
  $scope.edit = {};

  $scope.computeTotalRemainder = function () {
    if (isNaN($scope.edit.transaction_amount) === false) {
      $scope.totalOwe = totalOweCopy - $scope.edit.transaction_amount;
    } else {
      $scope.totalOwe = totalOweCopy;
    }
  };

  dbEngine2.query('sales', function (data) {
    for (index in data) {
      if (data[index].sale_customer_customer_id === $scope.customerId) {
        $scope.totalOwe += (data[index].sale_item_unit_price * data[index].sale_item_quantity);
      }
    }

    // and then we look through transactions the customer made
    dbEngine2.query('transactions', function (data) {
      for (index in data) {
        if (data[index].transaction_id === $scope.transactionId) {
          $scope.edit = angular.copy(data[index]);
        }

        if (data[index].trasaction_customer_customer_id === $scope.customerId) {
          $scope.totalOwe -= data[index].transaction_amount;
        }
      }

      totalOweCopy = angular.copy($scope.totalOwe);
      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  });

  this.update = function () {
    dbEngine2.update('transactions', $scope.edit, function (data) {
      $scope.edit = data;

      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  };

  this.delete = function () {
    dbEngine2.delete('transactions', $scope.edit, function (data) {
      $location.path('customers/deposits/'+ $scope.customerId);

      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  };

  $scope.depositsEditCtrl = this;
}]);



var depositViaAccountCtrl = app.controller('depositViaAccountCtrl',
                                           ['$rootScope', '$scope', '$routeParams', '$location', 'dbEngine2',
                                           function ($rootScope, $scope, $routeParams, $location, dbEngine2) {

  $scope.accountId = Number($routeParams.accountId);
  dbEngine2.query('transactions', function (data) {
    console.log(data);
  });

  $scope.depositViaAccountCtrl = this;
}]);



var depositViaAccountNewCtrl = app.controller('depositViaAccountNewCtrl',
                                              ['$rootScope', '$scope', '$routeParams', '$location', '$filter', 'dbEngine2',
                                              function ($rootScope, $scope, $routeParams, $location, $filter, dbEngine2) {
  var promiseData = $rootScope.promiseData;
  $scope.accountId = Number($routeParams.accountId);
  $scope.userId = Number(localStorage.user_id);
  $scope.totalHold = 0;
  $scope.instance = {
    transaction_type: 'ACCOUNT-DEPOSIT',
    transaction_amount: '',
    transaction_hold: '',
    transaction_transfer: '',
    transaction_description: '',
    transaction_timestamp: '',
    transaction_account_account_id: $scope.accountId,
    trasaction_customer_customer_id: '',
    transaction_user_user_id: $scope.userId,
    trasaction_sale_sale_id: '',
    transaction_account_from_account_id: ''
  };

  // building current user hold account
  // precedence: oldest to newest sale, when cleaning out the hold account i.e.
  // here we're going to be using `sale_auto_transfer`
  for (sale in promiseData.sales) {
    if (promiseData.sales[sale].sale_user_user_id === $scope.userId) {
      $scope.totalHold += (promiseData.sales[sale].sale_hold - promiseData.sales[sale].sale_auto_transfer);
    }
  }

  var totalHoldCopy = $scope.totalHold;

  $scope.depositViaAccountNewCtrl = this;
}]);
