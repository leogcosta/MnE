// yet another `fake` engine that syncs data with the central server
var syncEngine = angular.module('syncEngine', ['dbEngine']);

syncEngine.factory('syncEngine', ['$rootScope', '$q', '$http', 'dbEngine', function ($rootScope, $q, $http, dbEngine) {
  var deferred = $q.defer();
  var that = {};

  // our `generic` SQL error handler
  var SQLErrorHandeler = function (SQLTransaction, error) {
    console.error(error);
  };

  // this is like dbEngine's save but a `bit` different
  // here, ERYthing WILL go without a glitch
  function save (tableName, SQL) {
    dbEngine.WebSQL.db.transaction(function (SQLTransaction) {
      SQLTransaction.executeSql('INSERT INTO '+ tableName +' ('+ SQL.selectKey +') VALUES ('+ SQL.wild +')', SQL.value, function (SQLTransaction, SQLResultSet) {
      }, SQLErrorHandeler);
    });
  }

  // this will merge (forcefully) the returned data with the local db
  function merge (data) {
    for (key in data) {
      // clearing the table
      dbEngine.WebSQL.db.transaction(function (SQLTransaction) {
        SQLTransaction.executeSql('DELETE FROM '+ key +'', [], function (SQLTransaction, SQLResultSet) {
          that[key] = [];

          for (row in data[key][key]) {
            var SQL = {
              selectKey: '',
              value: [],
              wild: []
            };

            that[key].push(data[key][key][row]);

            for (objKey in data[key][key][row]) {
              SQL.value.push(data[key][key][row][objKey]);
              SQL.wild.push('?');
            }

            SQL.selectKey = Object.keys(data[key][key][row]).join(', ');
            SQL.wild = SQL.wild.join(', ');

            save(key, SQL);
          }

          // this `fixes` the lag
          // am like (to the freaken' bug)
          // i will find you and i will kill you! (Liam Neces - Taken)
          for (key in that) {
            $rootScope.data[key] = that[key];
          }

          if ($rootScope.$$phase === null) {
            $rootScope.$apply();
          }

          notify({message: 'sync completed'});
          deferred.resolve('sync completed');
        }, SQLErrorHandeler);
      });
    }
  }

  // this will send `push` request to the server
  function push (sync) {
    $http.post('api/sync', sync).success(function (data, status, headers, config) {
      merge(data);
    }).error(function (data, status, headers, config) {
      console.error(data);
    });
  }

  // pseudo code:
  // table sync order: customers > items > accounts > sales > transactions
  // 1: sync delete - if successful ACTUALLY delete the row
  // 2: sync update - if update fails - SAVE the row (row created and edited while offline)
  // 3: sync save - if save fails - well we're screwed! - this should have not happened! - Megan Fox help us!
  // 4: trigger refresh - by firing off an event 'sync-completed'...
  //    $rootScope.$broadcast('sync-completed') --- turned out won't be using this
  //    until the `bug` is fixed
  //
  // the syncing logic is `like` git where each user has an EXACT copy of the
  // central server data - and changes are pushed (after making suer there aren't any conflicts)
  return function () {
    notify({message: 'syncing...'});

    var sync = {
      customers: {
        SAVE: [],
        DELETE: [],
        UPDATE: []
      }
    };
    // pushing all `local` changes to the server...
    // reading tables where operation is either SAVE, DELETE OR UPDATE...

    // reading customers...
    dbEngine.WebSQL.db.transaction(function (SQLTransaction) {
      SQLTransaction.executeSql('SELECT customer_id, customer_full_name, customer_phone_number, customer_email, customer_user_user_id, operation FROM customers WHERE operation = ? OR operation = ? OR operation = ?', ['SAVE', 'UPDATE', 'DELETE'], function (SQLTransaction, SQLResultSet) {
        // seems everything looks in sync
        for (var i = 0; i < SQLResultSet.rows.length; i++) {
          var row = SQLResultSet.rows.item(i);
          sync.customers[row.operation].push(row);
        }

        // sending the `push` request...
        push(sync);
      }, SQLErrorHandeler);
    });

    return deferred.promise;
  };
}]);
