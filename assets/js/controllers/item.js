var itemCtrl = app.controller('itemCtrl', ['$scope', '$location', '$routeParams', 'dbEngine', function ($scope, $location, $routeParams, dbEngine) {
  dbEngine.get('items', $routeParams.id, function (data, status, headers, config) {
    data.item_unit_price = Number(data.item_unit_price);
    $scope.item = data;

    if ($scope.$$phase === null) {
      $scope.$apply();
    }
  });

  this.update = function () {
    dbEngine.update('items', $scope.item, function (data, status, headers, config) {
      data.item_unit_price = Number(data.item_unit_price);
      $scope.item = data;

      if ($scope.$$phase === null) {
        $scope.$apply();
      }
    });
  };

  this.delete = function () {
    dbEngine.delete('items', 'item_id', $scope.item.item_id, function (data, status, headers, config) {
      $location.path('/items');

      if ($scope.$$phase === null) {
        $scope.$apply();
      }
    });
  };

  $scope.itemCtrl = this;
}]);
