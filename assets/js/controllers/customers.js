var customersCtrl = app.controller('customersCtrl', ['$scope', 'dbEngine2', function ($scope, dbEngine2) {
  dbEngine2.query('customers', function (data) {
    $scope.customers = data;
  });

  $scope.customersCtrl = this;
}]);



var customerNewCtrl = app.controller('customerNewCtrl', ['$scope', 'dbEngine2', function ($scope, dbEngine2) {
  $scope.customerNewCtrl = this;
}]);



var customerEditCtrl = app.controller('customerEditCtrl', ['$scope', 'dbEngine2', function ($scope, dbEngine2) {
  $scope.customerEditCtrl = this;
}]);
