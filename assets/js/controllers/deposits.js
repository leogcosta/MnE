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
  // amount deposited will be automatically deposited to the current user's
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
  $scope.userId = Number(localStorage.user_id);
  $scope.accountDeposits = [];
  dbEngine2.query('transactions', function (data) {
    for (transaction in data) {
      // transaction must be associated with an account AND
      // if so, must be associated with *this* accountId AND
      // must be `owned` by the current user
      if (data[transaction].transaction_type === 'ACCOUNT-DEPOSIT' &&
          data[transaction].transaction_account_account_id === $scope.accountId &&
          data[transaction].transaction_user_user_id === $scope.userId) {
        data[transaction].moment = {
          age: moment(data[transaction].transaction_timestamp, 'YYYY-MM-DD HH:mm:ss').fromNow(),
          time: moment(data[transaction].transaction_timestamp, 'YYYY-MM-DD HH:mm:ss').format('hh:mm A'),
          month: moment(data[transaction].transaction_timestamp, 'YYYY-MM-DD HH:mm:ss').format('MMMM'),
          year: moment(data[transaction].transaction_timestamp, 'YYYY-MM-DD HH:mm:ss').format('YYYY')
        };

        $scope.accountDeposits.push(data[transaction]);
      }
    }

    if ($rootScope.$$phase === null) {
      $rootScope.$apply();
    }
  });

  $scope.depositViaAccountCtrl = this;
}]);



var depositViaAccountEditCtrl = app.controller('depositViaAccountEditCtrl',
                                           ['$rootScope', '$scope', '$routeParams', '$location', 'dbEngine2',
                                           function ($rootScope, $scope, $routeParams, $location, dbEngine2) {

  $scope.userId = Number(localStorage.user_id);
  $scope.accountId = Number($routeParams.accountId);
  $scope.transactionId = Number($routeParams.transactionId);
  $scope.edit = {};
  $scope.totalHold = 0;



  var promiseData = $rootScope.promiseData,
      totalHoldCopy = 0,
      originalTransactionAmount = 0,
      update = function (mode, diff) {
        if (mode === 'MORE') {
          var depositAmount = diff;
          var userId = Number(localStorage.user_id);
          var transferedSales = [];
          for (sale in promiseData.sales) {
            if (promiseData.sales[sale].sale_user_user_id === userId) {
              if (promiseData.sales[sale].sale_hold > 0) {
                if (depositAmount > promiseData.sales[sale].sale_hold) {
                  depositAmount -= promiseData.sales[sale].sale_hold;
                  promiseData.sales[sale].sale_auto_transfer += promiseData.sales[sale].sale_hold;
                  promiseData.sales[sale].sale_hold = 0;
                } else {
                  promiseData.sales[sale].sale_auto_transfer += depositAmount;
                  promiseData.sales[sale].sale_hold -= depositAmount;
                  depositAmount = 0;
                }

                transferedSales.push(promiseData.sales[sale]);
              }
            }

            if (depositAmount === 0) {
              console.log('ENOUGH! --- am washing my hands!');
              break;
            }
          }

          var ENOUGH = 0, transferedSalesLength = transferedSales.length;
          for (transfer in transferedSales) {
            dbEngine2.update('sales', transferedSales[transfer], function (data) {
              if (++ENOUGH === transferedSalesLength) {
                console.log('washed my hands!');
                //$location.path('accounts/deposit/'+ $scope.accountId);
              }

              if ($rootScope.$$phase === null) {
                $rootScope.$apply();
              }
            }, true);
          }
        } else if (mode === 'REVERT') {
          // we're going to be doing the REVRESE of what we did up there
          var depositAmount = 0;
          var userId = Number(localStorage.user_id);
          var transferedSales = [];
          for (sale in promiseData.sales) {
            if (promiseData.sales[sale].sale_user_user_id === userId) {
              if (promiseData.sales[sale].sale_auto_transfer > 0) {
                if (promiseData.sales[sale].sale_auto_transfer > diff) {
                  promiseData.sales[sale].sale_auto_transfer -= diff;
                  promiseData.sales[sale].sale_hold += diff;
                  depositAmount = diff;
                } else {
                  promiseData.sales[sale].sale_hold += promiseData.sales[sale].sale_auto_transfer;
                  depositAmount += promiseData.sales[sale].sale_auto_transfer;
                  promiseData.sales[sale].sale_auto_transfer = 0;
                }

                transferedSales.push(promiseData.sales[sale]);
              }
            }

            if (depositAmount === diff) {
              console.log('ENOUGH! --- am washing my hands!');
              break;
            }
          }

          var ENOUGH = 0, transferedSalesLength = transferedSales.length;
          for (transfer in transferedSales) {
            dbEngine2.update('sales', transferedSales[transfer], function (data) {
              if (++ENOUGH === transferedSalesLength) {
                console.log('washed my hands!');
                //$location.path('accounts/deposit/'+ $scope.accountId);
              }

              if ($rootScope.$$phase === null) {
                $rootScope.$apply();
              }
            }, true);
          }
        }
      };



  for (sale in promiseData.sales) {
    if (promiseData.sales[sale].sale_user_user_id === $scope.userId) {
      $scope.totalHold += promiseData.sales[sale].sale_hold;
    }
  }
  totalHoldCopy = $scope.totalHold;

  // here we have to be careful --- once a transaction is auto transfered
  // things can get really messy, so a lot of validations will be here
  dbEngine2.get('transactions', $routeParams.transactionId, function (data) {
    $scope.edit = data;
    originalTransactionAmount = data.transaction_amount;

    if ($rootScope.$$phase === null) {
      $rootScope.$apply();
    }
  });

  $scope.computeTotalHold = function () {
    $scope.totalHold = totalHoldCopy - $scope.edit.transaction_amount;

    if (isNaN($scope.totalHold) === true) {
      $scope.totalHold = totalHoldCopy;
    }
  };

  this.update = function () {
    dbEngine2.update('transactions', $scope.edit, function (data) {
      delete data.message;
      $scope.edit = data;
      // here it's going to be a little `tricky`
      // this ain't going to be a normal update
      if (originalTransactionAmount > $scope.edit.transaction_amount) {
        update('REVERT', (originalTransactionAmount - $scope.edit.transaction_amount));
      } else if (originalTransactionAmount < $scope.edit.transaction_amount) {
        update('MORE', ($scope.edit.transaction_amount - originalTransactionAmount));
      } else {
        console.log('pretend nothing happened...');
        // $location.path('accounts/deposit/'+ $scope.accountId);
        // if ($rootScope.$$phase === null) {
        //   $rootScope.$apply();
        // }
      }

      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  };

  this.delete = function () {
    // same deal on deletion too --- if transfer is involved we need
    // to give it back before we X it
    update('REVERT', $scope.edit.transaction_amount);
    dbEngine2.delete('transactions', $scope.edit, function (data) {
      // rest assured, there's going to be no conflict between the two async
      // functions --- since both deal with two different tables
      console.log('deletion completed `after` REVERT');

      $location.path('accounts/deposit/'+ $scope.accountId);
      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  };

  $scope.depositViaAccountEditCtrl = this;
}]);



var depositViaAccountNewCtrl = app.controller('depositViaAccountNewCtrl',
                                              ['$rootScope', '$scope', '$routeParams', '$location', 'dbEngine2',
                                              function ($rootScope, $scope, $routeParams, $location, dbEngine2) {
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
      $scope.totalHold += promiseData.sales[sale].sale_hold;
    }
  }

  var totalHoldCopy = $scope.totalHold;

  $scope.computeTotalHold = function () {
    $scope.totalHold = totalHoldCopy - $scope.instance.transaction_amount;

    if (isNaN($scope.totalHold) === true) {
      $scope.totalHold = totalHoldCopy;
    }
  };

  this.save = function () {
    dbEngine2.save('transactions', $scope.instance, function (data) {
      // if the transaction goes through --- we'll go through the sales of
      // *this* customer and deduct form his/her hold until everything balances

      // until we reach to total amount of deposit we'll go through deducting
      // and transferring to `sale_auto_transfer`
      var depositAmount = $scope.instance.transaction_amount;
      var userId = $scope.userId;
      var transferedSales = []; // this will hold sales that are `affected` by this
      for (sale in promiseData.sales) {
        if (promiseData.sales[sale].sale_user_user_id === userId) {
          // there is money in the `hold-account` to be auto-transfered
          if (promiseData.sales[sale].sale_hold > 0) {
            // checking if we need to drain the hold account or take what's enough
            // drain it
            if (depositAmount > promiseData.sales[sale].sale_hold) {
              depositAmount -= promiseData.sales[sale].sale_hold;
              promiseData.sales[sale].sale_auto_transfer += promiseData.sales[sale].sale_hold;
              promiseData.sales[sale].sale_hold = 0;
            } else {
              // we just need to take off a tiny bit
              promiseData.sales[sale].sale_auto_transfer += depositAmount;
              promiseData.sales[sale].sale_hold -= depositAmount;
              depositAmount = 0;
            }

            transferedSales.push(promiseData.sales[sale]);
          }
        }

        if (depositAmount === 0) {
          console.log('ENOUGH! --- am washing my hands!');
          break;
        }
      }

      var ENOUGH = 0, transferedSalesLength = transferedSales.length;
      for (transfer in transferedSales) {
        dbEngine2.update('sales', transferedSales[transfer], function (data) {
          if (++ENOUGH === transferedSalesLength) {
            console.log('washed my hands!');
            $location.path('accounts/deposit/'+ $scope.accountId);
          }

          if ($rootScope.$$phase === null) {
            $rootScope.$apply();
          }
        }, true);
      }
    });
  };

  $scope.depositViaAccountNewCtrl = this;
}]);
