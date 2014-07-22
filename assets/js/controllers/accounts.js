var accountsCtrl = app.controller('accountsCtrl',
                                  ['$rootScope', '$scope', 'dbEngine2',
                                  function ($rootScope, $scope, dbEngine2) {
  var transactions = $rootScope.promiseData.transactions;

  dbEngine2.query('accounts', function (data) {
    for (account in data) {
      data[account].balance = 0;

      for (transaction in transactions) {
        if (transactions[transaction].transaction_account_account_id === data[account].account_id) {
          switch (transactions[transaction].transaction_type) {
            case 'ACCOUNT-DEPOSIT':
            case 'ACCOUNT-TRANSFER':
              data[account].balance += transactions[transaction].transaction_amount;
            break;

            case 'ACCOUNT-WITHDRAW':
              data[account].balance -= transactions[transaction].transaction_amount;
            break;
          }
        }
      }

      $scope.accounts = data;
    }

    if ($rootScope.$$phase === null) {
      $rootScope.$apply();
    }
  });
}]);



var accountNewCtrl = app.controller('accountNewCtrl',
                                    ['$rootScope', '$scope', '$location', 'dbEngine2',
                                    function ($rootScope, $scope, $location, dbEngine2) {
  $scope.instance = {
    account_name: '',
    account_timestamp: ''
  };

  this.save = function () {
    dbEngine2.save('accounts', $scope.instance, function (data) {
      $location.path('/accounts');

      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  };

  $scope.saveCtrl = this;
}]);



var accountEditCtrl = app.controller('accountEditCtrl',
                                     ['$rootScope', '$scope', '$routeParams', '$location', 'dbEngine2',
                                     function ($rootScope, $scope, $routeParams, $location, dbEngine2) {
  $scope.edit = {};

  dbEngine2.get('accounts', $routeParams.id, function (data) {
    $scope.edit = data;

    if ($rootScope.$$phase === null) {
      $rootScope.$apply();
    }
  });

  this.update = function () {
    dbEngine2.update('accounts', $scope.edit, function (data) {
      $scope.edit = data;

      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  };

  this.delete = function () {
    dbEngine2.delete('accounts', $scope.edit, function (data) {
      $location.path('/accounts');

      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  };

  $scope.editCtrl = this;
}]);



var accountLogCtrl = app.controller('accountLogCtrl',
                                    ['$rootScope', '$scope', '$routeParams', 'dbEngine2',
                                    function ($rootScope, $scope, $routeParams, dbEngine2) {
  var accountId = Number($routeParams.accountId),
      transactions = $rootScope.promiseData.transactions;
  $scope.transactions = [];

  for (transaction in transactions) {
    if (transactions[transaction].transaction_account_account_id === accountId) {
      transactions[transaction].moment = {
        age: moment(transactions[transaction].transaction_timestamp, 'YYYY-MM-DD HH:mm:ss').fromNow(),
        time: moment(transactions[transaction].transaction_timestamp, 'YYYY-MM-DD HH:mm:ss').format('hh:mm A'),
        month: moment(transactions[transaction].transaction_timestamp, 'YYYY-MM-DD HH:mm:ss').format('MMMM'),
        year: moment(transactions[transaction].transaction_timestamp, 'YYYY-MM-DD HH:mm:ss').format('YYYY')
      };

      $scope.transactions.push(transactions[transaction]);
    }
  }
}]);
