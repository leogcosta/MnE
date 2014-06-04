var customerCtrl = app.controller('customerCtrl', ['$scope', '$location', '$http', 'dbEngine', function ($scope, $location, $http, dbEngine) {
  dbEngine.bootWebSQL();
  $scope.customerCtrl = this;
}]);
