var customersCtrl = app.controller('customersCtrl', ['$scope', '$location', '$http', 'dbEngine', function ($scope, $location, $http, dbEngine) {
  dbEngine.bootWebSQL();
  $scope.customersCtrl = this;
}]);
