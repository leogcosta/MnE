var itemNewCtrl = app.controller('itemNewCtrl', ['$scope', '$location', 'dbEngine', function ($scope, $location, dbEngine) {
  $scope.newItem = {
    item_item_id: '',
    item_name: '',
    item_unit_price: ''
  };

  this.save = function () {
    dbEngine.save('items', $scope.newItem, function (data, status, headers, config) {
      $location.path('/items');

      if ($scope.$$phase === null) {
        $scope.$apply();
      }
    });
  };

  $scope.itemNewCtrl = this;
}]);
