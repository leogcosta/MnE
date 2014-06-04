var loginCtrl = app.controller('loginCtrl', ['$scope', '$location', '$http', 'dbEngine', function ($scope, $location, $http, dbEngine) {
  $scope.credentials = {
    username: '',
    password: ''
  };

  // `login` low:
  // - first we're going to check the local storage for a `logged` in user
  // - if a user exists we'll skip the login page and redirect to the app home
  // - if a user doest exist well he/she has to be logged in
  //
  // PS:
  // i know and you know it's VERY easy to `trick` the app in to thinking
  // someone is logged in, but at the end of the day REAL validation takes place
  // at the server side so #BOOM

  // checking for `session`...
  if (localStorage.user_username !== undefined) {
    $location.path('/customer');
  }

  // this action REQUIRES connection with the server
  this.submit = function () {
    $http.post('api/login', $scope.credentials).success(function (data, status, headers, config) {
      for (key in data) {
        localStorage[key] = data[key];
      }

      // dbEngine.bootWebSQL();
      $location.path('/customer');
    }).error(function (data, status, headers, config) {
      console.log(data);
      notify(data);
    });
  };

  $scope.loginCtrl = this;
}]);
