var moreCtrl = app.controller('moreCtrl', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location) {
  // i know i could use href but the styling will send me back to the
  // stone age --- so am sticking with what i know *best*

  this.path = function (path) {
    $location.path(path);

    if ($rootScope.$$phase === null) {
      $rootScope.$apply();
    }
  };

  $scope.moreCtrl = this;
}]);
