var customersCtrl = app.controller('customersCtrl', ['$rootScope', 'dbEngine', function ($rootScope, dbEngine) {
  dbEngine.query('customers', function (data, status, headers, config) {
    $rootScope.data.customers = data;

    if ($rootScope.$$phase === null) {
      $rootScope.$apply();
    }
  });

  /*
  // Bug Godzilla:
  // whenever 'sync-completed' is fired we're going to `reload` the current
  // listing, we're not going to be loading ERY where, just where it matters.
  // `more` code on our side, but worth it --- i think
  $rootScope.$on('sync-completed', function () {
    // for some reason i quite don't understand after firing `sync-completed`
    // it takes like forever for dbEngine to callback - NOT dbEngine engine's
    // fault because i tested it with like infinity callbacks and all went
    // well without a glitch
    dbEngine.query('customers', function (data, status, headers, config) {
      $rootScope.data.customers = data;

      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    });
  });
  */
}]);
