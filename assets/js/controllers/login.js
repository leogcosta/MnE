var loginCtrl = app.controller('loginCtrl',
                               ['$rootScope', '$scope', '$location', '$http', '$q', '$timeout', 'dbEngine2', 'syncEngine2',
                               function ($rootScope, $scope, $location, $http, $q, $timeout, dbEngine2, syncEngine2) {
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
  // checking for online `status`
  // if the app is online we're going to be checking for session
  // if all is good we'll change the path to /customers
  // else --- you don't wanna know!
  if ($rootScope.online) {
    $http.get('api/login').success(function (data, status, headers, config) {
      notify({message: 'welcome back ('+ localStorage.user_username +')'});
      $location.path('/customers');
    }).error(function (data, status, headers, config) {
      console.error(data);
    });
  } else {
    // we're going to be checking the localStorage for `credentials`
    if (localStorage.user_username !== undefined) {
      notify({message: 'welcome back ('+ localStorage.user_username +')'});
      $location.path('/customers');

      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    } else {
      console.error('am confused!');
    }
  }

  // temporary issue fix on app launch
  $timeout(function () {
    if ($rootScope.online === false) {
      $location.path('/customers');

      if ($rootScope.$$phase === null) {
        $rootScope.$apply();
      }
    }
  }, 3000);

  // this action REQUIRES connection with the server
  this.submit = function () {
    $http.post('api/login', $scope.credentials).success(function (data, status, headers, config) {
      // instead of JS readable cookies
      // we're going to use local storage, easy --- i think
      for (key in data) {
        localStorage[key] = data[key];
      }

      // on inital ONLINE login --- we'll be calling sync to well...
      // SYNC!
      var sync = {
        keys: Object.keys(dbEngine2.webdb.sql),
        length: Object.keys(dbEngine2.webdb.sql).length,
        index: 0
      };

      var iSyncDeferred = $q.defer();

      var iSync = function () {
        syncEngine2.syncTable(sync.keys[sync.index], function (data) {
          if (++sync.index < sync.length) {
            iSync();
          } else if (sync.index === sync.length) {
            iSyncDeferred.resolve('finished sync');
          }
        });

        return iSyncDeferred.promise;
      };

      notify({message: 'syncing...'});
      iSync().then(function (msg) {
        notify({message: 'sync completed'});
        $rootScope.$broadcast('SYNC');
        $location.path('/customers');
        console.log(msg);

        if ($rootScope.$$phase === null) {
          $rootScope.$apply();
        }
      });
    }).error(function (data, status, headers, config) {
      notify(data);
      console.error(data);
    });
  };

  $scope.loginCtrl = this;
}]);
