var itemsCtrl = app.controller('itemsCtrl', ['$rootScope', 'dbEngine', function ($rootScope, dbEngine) {
  dbEngine.query('items', function (data, status, headers, config) {
    $rootScope.data.items = data;

    if ($rootScope.$$phase === null) {
      $rootScope.$apply();
    }
  });
}]);
