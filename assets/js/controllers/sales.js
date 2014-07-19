var saleViaCustomerListCtrl = app.controller('saleViaCustomerListCtrl',
                               ['$rootScope', '$scope', '$routeParams', 'dbEngine2',
                               function ($rootScope, $scope, $routeParams, dbEngine2) {

  $scope.customer_id =  Number($routeParams.id);
  $scope.items = [];

  dbEngine2.query('sales', function (data) {
    data = angular.copy(data);
    // to avoid over head on the sever side, we'll be filtering through the
    // list here --- hey am flipping the game here
    //
    // we're going to be making a copy of data to avoid dynamically changing
    // the iterator --- which i *think* makes the loop `expensive` and
    // bug prone
    var list = [];

    for (index in data) {
      if (data[index].sale_customer_customer_id === $scope.customer_id) {
        list.push(data[index]);
      }
    }

    var iReference = function (index) {
      // this is VERY expensive so we're going to query whole list of items
      // and reference that shit
      for (item_index in $scope.items) {
        if ($scope.items[item_index].item_id === list[index].sale_item_item_id) {
          list[index].sale_item_item_id = angular.copy($scope.items[item_index]);
          list[index].sale_timestamp_age = moment(list[index].sale_timestamp, 'YYYY-MM-DD HH:mm:ss').fromNow();
          list[index].sale_timestamp = moment(list[index].sale_timestamp, 'YYYY-MM-DD HH:mm:ss').format('MMMM DD, YYYY @ hh:mm A');

          if (++DON === iCount) {
            $scope.sales = list;
          }
        }
      }
    }, iCount = list.length, DON = 0;

    dbEngine2.query('items', function (data) {
      $scope.items = data;

      // once we set the times it's now time to reference the shit out of it
      for (index in list) {
        iReference(index);
      }

      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  });
}]);



var saleViaItemNewCtrl = app.controller('saleViaItemNewCtrl', [
                                        '$rootScope', '$scope', '$routeParams', '$filter', '$location', 'dbEngine2',
                                        function ($rootScope, $scope, $routeParams, $filter, $location, dbEngine2) {

  var promiseData = angular.copy($rootScope.promiseData);
  $scope.customers = promiseData.customers;
  $scope.item = {};
  $scope.instance = {
    sale_item_item_id: '',
    sale_item_quantity: 1,
    sale_item_unit_price: '',
    sale_owe: '',
    sale_hold: 0,
    sale_timestamp: '',
    sale_customer_customer_id: '',
  };

  dbEngine2.get('items', $routeParams.itemId, function (data) {
    $scope.item = angular.copy(data);
    $scope.instance.sale_item_item_id = $scope.item.item_id;
    $scope.instance.sale_item_unit_price = $scope.item.item_unit_price;
    $scope.total = $scope.item.item_unit_price;

    if ($rootScope.$$phase === null) {
      $rootScope.$apply();
    }
  });

  // we're using the filter *here* via JavaScript so we can have the nice
  // `?` when the form is invalid
  $scope.computeTotal = function () {
    $scope.total = $scope.instance.sale_item_quantity * $scope.instance.sale_item_unit_price;

    if (isNaN($scope.total) === true) {
      $scope.total = '?';
    } else {
      $scope.total = $filter('number')($scope.total, 2);
    }
  };

  this.save = function () {
    $scope.instance.sale_owe = $scope.instance.sale_item_unit_price * $scope.instance.sale_item_quantity;
    dbEngine2.save('sales', $scope.instance, function (data) {
      $location.path('/items');

      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  };

  $scope.saleViaItemNewCtrl = this;
}]);

saleViaItemNewCtrl.loadCustomers = function ($rootScope, $q, dbEngine2) {
  var deferred = $q.defer();

  dbEngine2.query('customers', function(data) {
    $rootScope.promiseData.customers = angular.copy(data);
    deferred.resolve();
  });

  return deferred.promise;
};



var saleViaCustomerNewCtrl = app.controller('saleViaCustomerNewCtrl',
                                 ['$rootScope', '$scope', '$routeParams', '$filter', '$location', 'dbEngine2',
                                 function ($rootScope, $scope, $routeParams, $filter, $location, dbEngine2) {

  $scope.customer_id = Number($routeParams.id);
  $scope.items = [];
  $scope.instance = {
    sale_item_item_id: '',
    sale_item_quantity: 1,
    sale_item_unit_price: '',
    sale_owe: '',
    sale_hold: 0,
    sale_timestamp: '',
    sale_customer_customer_id: $scope.customer_id,
  };

  $scope.computeTotal = function () {
    $scope.total = $scope.instance.sale_item_quantity * $scope.instance.sale_item_unit_price;
    if (isNaN($scope.total) === true) {
      $scope.total = '?';
    } else {
      $scope.total = $filter('number')($scope.total, 2);
    }
  };

  // fills the form according to the selected item
  $scope.fillForm = function () {
    for (index in $scope.items) {
      if (Number($scope.instance.sale_item_item_id) === $scope.items[index].item_id) {
        $scope.instance.sale_item_unit_price = $scope.items[index].item_unit_price;
      }
    }
    $scope.computeTotal();
  };

  dbEngine2.query('items', function (data) {
    $scope.items = data;

    if ($rootScope.$$phase === null) {
      $rootScope.$apply();
    }
  });


  dbEngine2.query('accounts', function (data) {
    $scope.accounts = data;

    if ($rootScope.$$phase === null) {
      $rootScope.$apply();
    }
  });

  this.save = function () {
    // we're sure the outcome would be a number because
    // save wouldn't be *active* if the whole form wasn't cool
    $scope.instance.sale_owe = $scope.instance.sale_item_unit_price * $scope.instance.sale_item_quantity;
    dbEngine2.save('sales', $scope.instance, function (data) {
      $location.path('/customers/sales/'+ $scope.customer_id);

      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  };

  $scope.saleViaCustomerNewCtrl = this;
}]);


var saleViaCustomerEditCtrl = app.controller('saleViaCustomerEditCtrl',
                                  ['$rootScope', '$scope', '$routeParams', '$location', '$filter', 'dbEngine2',
                                  function ($rootScope, $scope, $routeParams, $location, $filter, dbEngine2) {
  $scope.edit = {};
  $scope.items = [];
  // pseudo code
  // 1: query items
  // 2: get sale
  // 3: associate n' stuff


  $scope.computeTotal = function () {
    $scope.total = $scope.edit.sale_item_quantity * $scope.edit.sale_item_unit_price;
    if (isNaN($scope.total) === true) {
      $scope.total = '?';
    } else {
      $scope.total = $filter('number')($scope.total, 2);
    }
  };

  // fills the form according to the selected item
  $scope.fillForm = function () {
    for (index in $scope.items) {
      if (Number($scope.edit.sale_item_item_id) === $scope.items[index].item_id) {
        $scope.edit.sale_item_unit_price = $scope.items[index].item_unit_price;
      }
    }

    $scope.computeTotal();
  };

  dbEngine2.query('items', function (data) {
    $scope.items = data;

    dbEngine2.get('sales', $routeParams.saleId, function (data) {
      $scope.edit = data;
      $scope.total = $filter('number')(($scope.edit.sale_item_quantity * $scope.edit.sale_item_unit_price), 2);

      // this should handle both assignments
      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  });

  this.update = function () {
    dbEngine2.update('sales', $scope.edit, function (data) {
      $scope.edit = data;

      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  };

  this.delete = function () {
    dbEngine2.delete('sales', $scope.edit, function (data) {
      $location.path('/customers/sales/'+ $routeParams.customerId);

      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  };

  $scope.saleViaCustomerEditCtrl = this;
}]);


