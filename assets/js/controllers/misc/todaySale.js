var todaySalesCtrl = app.controller('todaySalesCtrl',
                                   ['$rootScope', '$scope', '$location',
                                   function ($rootScope, $scope, $location) {

  var promiseData = $rootScope.promiseData;
  $scope.todaySales = [];
  $scope.totalSale = 0;

  for (sale in promiseData.sales) {
    if (moment(promiseData.sales[sale].sale_timestamp, 'YYYY-MM-DD HH:mm:ss').isBefore(moment().format('YYYY-MM-DD HH:mm:ss'), 'day') === false) {
      // since we loaded sales via customer's promise, we need to subtract 30
      // minutes off of the timestamp
      //
      // TODO (yes, besides Megan Fox):
      // make sure if sales loaded via customer's promise are going to be
      // DISPLAYED make sure to subtract 30 minutes or so
      promiseData.sales[sale].sale_timestamp = moment(promiseData.sales[sale].sale_timestamp, 'YYYY-MM-DD HH:mm:ss').subtract('minutes', 30).format('YYYY-MM-DD HH:mm:ss');

      promiseData.sales[sale].moment = {
        age: moment(promiseData.sales[sale].sale_timestamp, 'YYYY-MM-DD HH:mm:ss').fromNow(),
        time: moment(promiseData.sales[sale].sale_timestamp, 'YYYY-MM-DD HH:mm:ss').format('hh:mm A'),
        month: moment(promiseData.sales[sale].sale_timestamp, 'YYYY-MM-DD HH:mm:ss').format('MMMM'),
        year: moment(promiseData.sales[sale].sale_timestamp, 'YYYY-MM-DD HH:mm:ss').format('YYYY')
      };

      for (item in promiseData.items) {
        if (promiseData.sales[sale].sale_item_item_id === promiseData.items[item].item_id) {
          promiseData.sales[sale].item = promiseData.items[item];
        }
      }

      $scope.totalSale += (promiseData.sales[sale].sale_item_unit_price * promiseData.sales[sale].sale_item_quantity);
      $scope.todaySales.push(promiseData.sales[sale]);
    }
  }

  for (sale in $scope.todaySales) {
    for (customer in promiseData.customers) {
      if ($scope.todaySales[sale].sale_customer_customer_id === promiseData.customers[customer].customer_id) {
        $scope.todaySales[sale].customer = promiseData.customers[customer];
        break;
      }
    }
  }

  $scope.todaySalesCtrl = this;
}]);



todaySalesCtrl.loadItems = function ($rootScope, $q, dbEngine2) {
  var deferred = $q.defer();

  dbEngine2.query('items', function(data) {
    $rootScope.promiseData.items = data;
    deferred.resolve();
  });

  return deferred.promise;
};
