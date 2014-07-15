var itemsCtrl = app.controller('itemsCtrl',
                               ['$rootScope', '$scope', 'dbEngine2',
                               function ($rootScope, $scope, dbEngine2) {
  dbEngine2.query('items', function (data) {
    $scope.items = data;

    if ($rootScope.$$phase === null) {
      $rootScope.$apply();
    }
  });
}]);



var itemNewCtrl = app.controller('itemNewCtrl',
                                 ['$rootScope', '$scope', '$location', 'dbEngine2',
                                 function ($rootScope, $scope, $location, dbEngine2) {
  $scope.instance = {
    item_item_id: '',
    item_name: '',
    item_unit_price: '',
    item_timestamp: ''
  };

  this.save = function () {
    dbEngine2.save('items', $scope.instance, function (data) {
      $location.path('/items');

      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  };

  $scope.saveCtrl = this;
}]);



var itemEditCtrl = app.controller('itemEditCtrl',
                                  ['$rootScope', '$scope', '$routeParams', '$location', 'dbEngine2',
                                  function ($rootScope, $scope, $routeParams, $location, dbEngine2) {
  $scope.edit = {};

  dbEngine2.get('items', $routeParams.id, function (data) {
    $scope.edit = data;

    if ($rootScope.$$phase === null) {
      $rootScope.$apply();
    }
  });

  this.update = function () {
    dbEngine2.update('items', $scope.edit, function (data) {
      $scope.edit = data;

      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  };

  this.delete = function () {
    dbEngine2.delete('items', $scope.edit, function (data) {
      $location.path('/items');

      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  };

  $scope.editCtrl = this;
}]);
