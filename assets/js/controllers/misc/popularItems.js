var popularItemsCtrl = app.controller('popularItemsCtrl',
                                   ['$rootScope', '$scope', '$location',
                                   function ($rootScope, $scope, $location) {

  var promiseData = $rootScope.promiseData;
  $scope.popularItems = [];

  for (item in promiseData.items) {
    for (sale in promiseData.sales) {
      if (promiseData.sales[sale].sale_item_item_id === promiseData.items[item].item_id) {
        if (promiseData.items[item].hasOwnProperty('saleCount')) {
          promiseData.items[item].saleCount += promiseData.sales[sale].sale_item_quantity;
        } else {
          promiseData.items[item].saleCount = promiseData.sales[sale].sale_item_quantity;
        }
      }
    }
  }

  for (item in promiseData.items) {
    if (promiseData.items[item].hasOwnProperty('saleCount') === false) {
      promiseData.items[item].saleCount = 0;
    }
  }

  $scope.popularItems = promiseData.items;
  $scope.popularItemsCtrl = this;
}]);
