// yet another `fake` engine that syncs data with the central server
var syncEngine = angular.module('syncEngine', ['dbEngine']);

syncEngine.factory('syncEngine', ['$rootScope', '$http', 'dbEngine', function ($rootScope, $http, dbEngine) {
  var that = {};

  that.sync = function () {
    notify({message: 'syncing...'});
  };

  return that;
}]);
