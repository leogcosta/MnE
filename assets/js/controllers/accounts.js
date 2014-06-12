var accountsCtrl = app.controller('accountsCtrl', ['$rootScope', 'dbEngine', 'syncEngine', function ($rootScope, dbEngine, syncEngine) {
  dbEngine.query('accounts', function (data, status, headers, config) {
    $rootScope.data.accounts = data;

    if ($rootScope.$$phase === null) {
      $rootScope.$apply();
    }
  });
}]);
