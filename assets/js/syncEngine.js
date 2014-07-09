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

  function clearAndMerge (key, data) {
    dbEngine.WebSQL.db.transaction(function (SQLTransaction) {
      SQLTransaction.executeSql('DELETE FROM '+ key +'', [], function (SQLTransaction, SQLResultSet) {
        that[key] = [];

        for (row in data[key]) {
          var SQL = {
            selectKey: '',
            value: [],
            wild: []
          };

          that[key].push(data[key][row]);

          for (objKey in data[key][row]) {
            SQL.value.push(data[key][row][objKey]);
            SQL.wild.push('?');
          }

          SQL.selectKey = Object.keys(data[key][row]).join(', ');
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
      });
    });
  }

  // this will merge (forcefully) the returned data with the local db
  function merge (data) {
    for (key in data) {
      clearAndMerge(key, data[key]);
    }

    console.info('sync completed');
    notify({message: 'sync completed'});
    deferred.resolve('sync completed');
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
      },
      items: {
        SAVE: [],
        DELETE: [],
        UPDATE: []
      },
      accounts: {
        SAVE: [],
        DELETE: [],
        UPDATE: []
      }
    };
    // pushing all `local` changes to the server...
    // reading tables where operation is either SAVE, DELETE OR UPDATE...

    dbEngine.WebSQL.db.transaction(function (SQLTransaction) {
      // reading customers...
      SQLTransaction.executeSql('SELECT customer_id, customer_full_name, customer_phone_number, customer_email, customer_user_user_id, operation FROM customers WHERE operation = ? OR operation = ? OR operation = ?', ['SAVE', 'UPDATE', 'DELETE'], function (SQLTransaction, SQLResultSet) {
        // seems everything looks in sync
        for (var i = 0; i < SQLResultSet.rows.length; i++) {
          var row = SQLResultSet.rows.item(i);
          sync.customers[row.operation].push(row);
        }

        // reading items...
        SQLTransaction.executeSql('SELECT item_id, item_item_id, item_name, item_unit_price, operation FROM items WHERE operation = ? OR operation = ? OR operation = ?', ['SAVE', 'UPDATE', 'DELETE'], function (SQLTransaction, SQLResultSet) {
          for (var i = 0; i < SQLResultSet.rows.length; i++) {
            var row = SQLResultSet.rows.item(i);
            sync.items[row.operation].push(row);
          }

          // reading accounts...
          SQLTransaction.executeSql('SELECT account_id, account_name, account_user_user_id, operation FROM accounts WHERE operation = ? OR operation = ? OR operation = ?', ['SAVE', 'UPDATE', 'DELETE'], function (SQLTransaction, SQLResultSet) {
            for (var i = 0; i < SQLResultSet.rows.length; i++) {
              var row = SQLResultSet.rows.item(i);
              sync.accounts[row.operation].push(row);
            }

            // sending the `push` request...
            push(sync);
          });
        });
      }, SQLErrorHandeler);
    });

    return deferred.promise;
  };
}]);



// syncEngine ALWAYS requires connectivity with the server - hence, sync
syncEngine.factory('syncEngine2', ['$rootScope', '$q', '$http', 'dbEngine2', function ($rootScope, $q, $http, dbEngine2) {
  var that = {};



  // this will go through the returned merge conflict messages
  // and it'll change their operation to 'MERGE'
  var merge = function (tableName, dataMerge, callback) {
    console.log('DON redecorating ['+ tableName +']!');
    console.log('MERGING ['+ tableName +']...');
    var iMergeCount = dataMerge.length, iCount = 0;

    if (iMergeCount > 0) {
      dbEngine2.webdb.db.transaction(function (SQLTransaction) {
        for (index in dataMerge) {
          var sql = {
            set: [],
            value: []
          };

          for (key in dataMerge[index]) {
            sql.set.push(key +' = ?');
            if (key === 'operation') {
              sql.value.push('MERGE');
            } else {
              sql.value.push(dataMerge[index][key] === null ? '' : dataMerge[index][key]);
            }
          }

          sql.set = sql.set.join(', ');
          sql.set += ' WHERE '+ dbEngine2.webdb.keys[tableName].primaryKey +' = ?';
          sql.value.push(dataMerge[index][dbEngine2.webdb.keys[tableName].primaryKey]);

          SQLTransaction.executeSql('UPDATE '+ tableName +' SET '+ sql.set, sql.value, function (SQLTransaction, SQLResultSet) {
            if (++iCount === iMergeCount) {
              callback();
            }
          }, function (SQLTransaction, error) {
            if (++iCount === iMergeCount) {
              callback();
            }
          });
        }
      }, SQLErrorHandeler);
    } else {
      callback();
    }
  };



  // a `light` version of the other stuff
  // a lot of things should slide without causing a racket...
  // did i spell that right or...
  var SQLErrorHandeler = function (SQLTransaction, error) {
    console.error(error);
  };



  // this will delete the local data (except for the exclusion list)
  // and stuff...
  // i haven't eaten lunch :(
  var purgeTable = function (tableName, data, callback) {
    // this will hold ID that will be omitted when `purging` the table
    var exclusionList = [];
    for (index in data.MERGE) {
      exclusionList.push(data.MERGE[index][dbEngine2.webdb.keys[tableName].primaryKey]);
    }

    dbEngine2.webdb.db.transaction(function (SQLTransaction) {
      SQLTransaction.executeSql('DELETE FROM '+ tableName +' WHERE '+ dbEngine2.webdb.keys[tableName].primaryKey +' NOT IN (?)', [exclusionList.join(', ')], function (SQLTransaction, SQLResultSet) {
        console.log('finished cleaning up ['+ tableName +']!');
        console.log('redecorating ['+ tableName +']...');
        var sqlExecutionCount = 0, dataListLength = data.LIST.length;

        for (index in data.LIST) {
          delete data.LIST[index].operation;

          var sql = {
            wild: [],
            value: [],
            key: Object.keys(data.LIST[index])
          };

          for (key in sql.key) {
            sql.wild.push('?');
            sql.value.push(data.LIST[index][sql.key[key]] === null ? '' : data.LIST[index][sql.key[key]]);
          }

          sql.wild = sql.wild.join(', ');

          // we get 'around' the sync behavior in a neat way
          // once we know we're "done" with the redecoration, we start
          // with the merging process
          SQLTransaction.executeSql('INSERT INTO '+ tableName +' ('+ sql.key.join(', ') +') VALUES ('+ sql.wild +')', sql.value, function (SQLTransaction, SQLResultSet) {
            if (++sqlExecutionCount === dataListLength) {
              // since we are done with the redecoration, we move on to
              // the merging process --- that way we can charge double
              // #BOOM!
              merge(tableName, data.MERGE, function () {
                console.log('MERGE completed on ['+ tableName +']!');
              });
            }
          }, function (SQLTransaction, error) {
            if (++sqlExecutionCount === dataListLength) {
              merge(tableName, data.MERGE, function () {
                console.log('MERGE completed on ['+ tableName +']!');
              });
            }
          });
        }
      }, SQLErrorHandeler);
    }, SQLErrorHandeler);
  };



  that.syncTable = function (tableName, callback) {
    if ($rootScope.online === true) {
      // between calling the dbEngine and syncEngine if someone else
      // called it --- then we would be a heap of trouble :)
      $rootScope.syncMode = true;

      var syncList = {
        DELETE: [],
        SAVE: [],
        UPDATE: []
      };

      // we'll fetch the local data with operation tags of
      // SAVE, DELETE and MERGE and send it to the server and merge whatever is
      // returned from the server i.e. the server knows best principle
      dbEngine2.query(tableName, function (data, status, headers, config) {
        for (row in data) {
          if (syncList.hasOwnProperty(data[row].operation)) {
            syncList[data[row].operation].push(data[row]);
          }
        }

        $http.post('api/sync/'+ tableName, syncList).success(function (data, status, headers, config) {
          // merging returned data...
          // i get a feeling that syncing might become expensive
          // 100ms of execution time in 4S is my threshold
          purgeTable(tableName, data, function () {
            console.log('purge completed!');
          });
        }).error(function (data, status, headers, config) {
          console.error(data);
        });
      });
    }
  };



  return that;
}]);
