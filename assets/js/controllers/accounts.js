var accountsCtrl = app.controller('accountsCtrl',
                                  ['$rootScope', '$scope', 'dbEngine2',
                                  function ($rootScope, $scope, dbEngine2) {
  dbEngine2.query('accounts', function (data) {
    $scope.accounts = data;

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
