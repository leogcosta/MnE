// yet another `fake` engine that syncs data with the central server
var syncEngine = angular.module('syncEngine', ['dbEngine']);



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
                callback();
              });
            }
          }, function (SQLTransaction, error) {
            if (++sqlExecutionCount === dataListLength) {
              merge(tableName, data.MERGE, function () {
                console.log('MERGE completed on ['+ tableName +']!');
                callback();
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
            // we'll be reordering the data structure before calling back
            // the callback --- Tropic Thunder, am the dude playin' the dude...
            for (index in data.MERGE) {
              data.MERGE[index].operation = 'MERGE';
              data.LIST.push(data.MERGE[index]);
            }

            data = data.LIST;
            callback(data);
          });
        }).error(function (data, status, headers, config) {
          console.error(data);
        });
      });
    }
  };



  return that;
}]);
