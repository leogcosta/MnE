var customersCtrl = app.controller('customersCtrl', ['$scope', '$q', 'dbEngine2', function ($scope, $q, dbEngine2) {
  /*
  dbEngine.query('customers', function (data, status, headers, config) {
    $rootScope.data.customers = data;

    if ($rootScope.$$phase === null) {
      $rootScope.$apply();
    }
  });
  */

  this.db = function () {
    // boot sequence
    dbEngine2.webdb.open().then(function (message) {
      console.log(message);

      dbEngine2.webdb.initiateTables().then(function (message) {
        console.log(message);

        dbEngine2.get('customers', 3, function (data, status, headers, config) {
          console.log(data);
        });
      }, function (error) {
        console.error(error);
      });
    }, function (error) {
      console.error(error);
    });

  };

  $scope.customersCtrl = this;
}]);
