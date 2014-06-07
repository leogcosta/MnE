// this is a `fake` database engine we're going to be using to handle all
// persistent storage plans, it's not going to be generic to Angular's motto of
// reusable services is out the window like THAT - sorry MASTER!
//
// am not going to be using the REST services provided by Angular since it's `hard`
// to handle errors without intercepting or something (without INTERCEPTION)
var dbEngine = angular.module('dbEngine', []);
dbEngine.factory('dbEngine', ['$rootScope', '$http', '$location', function ($rootScope, $http, $location) {
  var errorHandler = function (data, status, headers, config) {
    notify(data);
    console.error(data);

    switch (status) {
      // conflict on constraints
      // POST
      case 409:
      break;

      // conflict on constraints
      // PUT
      case 406:
      break;

      // precondition failed
      // forbidden (XSRF detection)
      case 412:
      case 403:
        setTimeout(function () {
          // redirecting to the login page in 3 - 2 - 1...
          document.location.href = window.location.origin + window.location.pathname;
        }, 3000);
      break;

      default:
      break
    }
  }



  // wrapping it in to a neat `single variable`
  var that = {
    WebSQL: {
      db: null,
      SQL: {}
    }
  };

  that.getWebSQLdb = function () {
    return openDatabase('mne', '1.0', 'MnE Database', (5*1024*1024));
  }

  // boot all necessary table creation on WebSQL in initial connection
  that.bootWebSQL = function () {
    that.WebSQL.db = openDatabase('mne', '1.0', 'MnE Database', (5*1024*1024));

    // since we're going to be managing only ONE user at a given time
    // `extra` column `operation` is going to be used for syncing purposes
    // and also we're not going to be checking for for foreign key constraints
    // if you tweak it it's your own fault - `tampered` data will fail to sync
    //
    // we will not be creating `users` table on the client side
    that.WebSQL.SQL = {
      customers: 'CREATE TABLE IF NOT EXISTS customers (customer_id INTEGER PRIMARY KEY ASC, customer_full_name VARCHAR UNIQUE, customer_phone_number VARCHAR, customer_email VARCHAR, customer_user_user_id INTEGER, operation VARCHAR);',
      items: 'CREATE TABLE IF NOT EXISTS items (item_id INTEGER PRIMARY KEY ASC, item_item_id VARCHAR UNIQUE, item_name VARCHAR, item_unit_price DECIMAL(10,3), operation VARCHAR);',
      accounts: 'CREATE TABLE IF NOT EXISTS accounts (account_id INTEGER PRIMARY KEY ASC, account_name VARCHAR UNIQUE, account_user_user_id INTEGER, operation VARCHAR);',
      sales: 'CREATE TABLE IF NOT EXISTS sales (sale_id INTEGER PRIMARY KEY ASC, sale_item_item_id INTEGER, sale_item_unit_price DECIMAL(10,3), sale_timestamp DATETIME, sale_hold DECIMAL(10,3), sale_customer_customer_id INTEGER, sale_user_user_id INTEGER, operation VARCHAR);',
      transactions: 'CREATE TABLE IF NOT EXISTS transactions (transaction_id INTEGER PRIMARY KEY ASC, transaction_type VARCHAR, transaction_amount DECIMAL(10,3), transaction_description TEXT, transaction_timestamp DATETIME, transaction_account_account_id INTEGER, transaction_user_user_id INTEGER, trasaction_sale_sale_id INTEGER, transaction_account_from_account_id INTEGER, operation VARCHAR);'
    };

    // so this is the `callback-hell` everyone is talking aboot
    that.WebSQL.db.transaction(function (SQLTransaction) {
      SQLTransaction.executeSql(that.WebSQL.SQL['customers'], [], function (SQLTransaction, SQLResultSet) {
        SQLTransaction.executeSql(that.WebSQL.SQL['items'], [], function (SQLTransaction, SQLResultSet) {
          SQLTransaction.executeSql(that.WebSQL.SQL['accounts'], [], function (SQLTransaction, SQLResultSet) {
            SQLTransaction.executeSql(that.WebSQL.SQL['sales'], [], function (SQLTransaction, SQLResultSet) {
              SQLTransaction.executeSql(that.WebSQL.SQL['transactions'], [], function (SQLTransaction, SQLResultSet) {
                console.info('WebSQL booting completed');
              }, function (SQLTransaction, e) {
                console.log('ERROR on TRANSATCIONS');
                console.log(e);
              });
            }, function (SQLTransaction, e) {
              console.log('ERROR on SALES');
              console.log(e);
            });
          }, function (SQLTransaction, e) {
            console.log('ERROR on ACCOUNTS');
            console.log(e);
          });
        }, function (SQLTransaction, e) {
          console.log('ERROR on ITEMS');
          console.log(e);
        });
      }, function (SQLTransaction, e) {
        console.log('ERROR on CUSTOMERS');
        console.log(e);
      });
    });
  };

  that.get = function (tableName, id, callback) {
    var SQL = {
      selectKey: '',
      primaryKey: '',
      value: [],
      wild: []
    };

    if ($rootScope.online) {
      $http.get('api/'+ tableName +'/'+ id).success(function (data, status, headers, config) {
        SQL.selectKey = Object.keys(data).join(', ');
        SQL.primaryKey = Object.keys(data)[0];
        for (key in data) {
          SQL.value.push(data[key]);
          SQL.wild.push('?');
        }

        SQL.wild = SQL.wild.join(', ');

        that.getWebSQLdb().transaction(function (SQLTransaction) {
          SQLTransaction.executeSql('SELECT '+ SQL.selectKey +' FROM '+ tableName +' WHERE '+ SQL.primaryKey +'=?', [id], function (SQLTransaction, SQLResultSet) {
            if (SQLResultSet.rows.length === 0) {
              SQLTransaction.executeSql('INSERT INTO '+ tableName +' ('+ SQL.selectKey +') VALUES ('+ SQL.wild +')', SQL.value, function (SQLTransaction, SQLResultSet) {
              }, function (SQLTransaction, error) {
                console.error(error);
              });
            }
          }, function (SQLTransaction, error) {
            console.error(error);
          });
        });

        callback(data, status, headers, config);
      }).error(errorHandler);
    } else {
      switch(tableName) {
        case 'customers':
          SQL.selectKey = 'customer_id, customer_full_name, customer_phone_number, customer_email, operation';
          SQL.primaryKey = 'customer_id';
        break;

        default:
        break;
      };

      that.getWebSQLdb().transaction(function (SQLTransaction) {
        SQLTransaction.executeSql('SELECT '+ SQL.selectKey +' FROM '+ tableName +' WHERE '+ SQL.primaryKey +'=? AND operation!=?', [id, 'DELETE'], function (SQLTransaction, SQLResultSet) {
          if (SQLResultSet.rows.length === 0) {
            notify({message: 'customer id '+ id +' does not exist'});
          } else {
            callback(SQLResultSet.rows.item(0), 200, null, null);
          }
        });
      });
    }
  };



  that.query = function (tableName, callback) {
    if ($rootScope.online) {
      $http.get('api/'+ tableName).success(function (data, status, headers, config) {
        callback(data, status, headers, config);
      }).error(errorHandler);
    } else {
      // so as to NOT pay huge processing time on * we're going to do a little
      // switch up game
      var selectKey = '';
      switch(tableName) {
        case 'customers':
          selectKey = 'customer_id, customer_full_name, customer_phone_number, customer_email, operation';
        break;

        default:
          selectKey = '*'
        break;
      }

      that.getWebSQLdb().transaction(function (SQLTransaction) {
        SQLTransaction.executeSql('SELECT '+ selectKey +' FROM '+ tableName +' WHERE operation!=? OR operation IS NULL', ['DELETE'], function (SQLTransaction, SQLResultSet) {
          if (SQLResultSet.rows.length === 0) {
            callback([], 200, null, null);
          } else {
            var rows = [], length = SQLResultSet.rows.length, i = 0;
            for (; i < length;i++) {
              rows.push(SQLResultSet.rows.item(i));
            }

            callback(rows, 200, null, null);
          }
        });
      });
    }
  };



  that.update = function (tableName, updateInstance, callback) {
    var SQL = {
      setKey: [],
      value: []
    };
    var dataCopy = {};

    if ($rootScope.online) {
      $http.put('api/'+ tableName +'/'+ updateInstance[Object.keys(updateInstance)[0]], updateInstance).success(function (data, status, headers, config) {
        dataCopy = angular.copy(data);
        delete dataCopy['message'];
        var keys = Object.keys(dataCopy).splice(1);

        for (key in keys) {
          SQL.setKey.push(keys[key] + '=?');
          SQL.value.push(dataCopy[keys[key]]);
        }

        SQL.setKey = SQL.setKey.join(', ');
        SQL.setKey += ' WHERE '+ Object.keys(dataCopy)[0] +'=?';
        SQL.value.push(dataCopy[Object.keys(dataCopy)[0]]);

        that.getWebSQLdb().transaction(function (SQLTransaction) {
          SQLTransaction.executeSql('UPDATE '+ tableName +' set '+ SQL.setKey, SQL.value, function (SQLTransaction, SQLResultSet) {
          }, function (SQLTransaction, error) {
            console.error(error);
          });
        });
      }).error(errorHandler);
    } else {
      var keys = Object.keys(updateInstance).splice(1);

      for (key in keys) {
        SQL.setKey.push(keys[key] + '=?');
        SQL.value.push(updateInstance[keys[key]]);
      }

      SQL.setKey.push('operation=?');
      SQL.value.push('UPDATE');
      SQL.setKey = SQL.setKey.join(', ');
      SQL.setKey += ' WHERE '+ Object.keys(updateInstance)[0] +'=?';
      SQL.value.push(updateInstance[Object.keys(updateInstance)[0]]);

      that.getWebSQLdb().transaction(function (SQLTransaction) {
        SQLTransaction.executeSql('UPDATE '+ tableName +' set '+ SQL.setKey, SQL.value, function (SQLTransaction, SQLResultSet) {
          updateInstance.message = 'customer updated';
          notify(updateInstance);
          callback(updateInstance, 202, null, null);
        }, function (SQLTransaction, error) {
          console.error(error);
        });
      });
    }
  };



  that.save = function (tableName, saveInstance, callback) {
    switch(tableName) {
      case 'customers':
        saveInstance['customer_user_user_id'] = localStorage.user_id;
      break;

      default:
      break;
    }

    var SQL = {
      selectKey: '',
      primaryKey: '',
      value: [],
      wild: []
    };
    var dataCopy = {};

    if ($rootScope.online) {
      $http.post('api/'+ tableName, saveInstance).success(function (data, status, headers, config) {
        // since we're going to be using the keys for query preparation
        // we don't need any surprises - so we're going to be removing
        // the message key which will save us from a heap of troubles!
        dataCopy = angular.copy(data);
        delete dataCopy['message'];

        that.getWebSQLdb().transaction(function (SQLTransaction) {
          SQL.selectKey = Object.keys(dataCopy).join(', ');
          SQL.primaryKey = Object.keys(dataCopy).splice(-1)[0];
          for (key in dataCopy) {
            SQL.value.push(dataCopy[key]);
            SQL.wild.push('?');
          }

          SQL.wild = SQL.wild.join(', ');
          SQLTransaction.executeSql('INSERT INTO '+ tableName +' ('+ SQL.selectKey +') VALUES ('+ SQL.wild +')', SQL.value, function (SQLTransaction, SQLResultSet) {
          }, function (SQLTransaction, error) {
            console.error(error);
          });
        }, function (SQLTransaction, error) {
          console.error(error);
        });

        notify(data);
        callback(data, status, headers, config);
      }).error(errorHandler);
    } else {
      saveInstance.operation = 'SAVE';

      that.getWebSQLdb().transaction(function (SQLTransaction) {
        SQL.selectKey = Object.keys(saveInstance).join(', ');
        for (key in saveInstance) {
          SQL.value.push(saveInstance[key]);
          SQL.wild.push('?');
        }

        SQL.wild = SQL.wild.join(', ');
        SQLTransaction.executeSql('INSERT INTO '+ tableName +' ('+ SQL.selectKey +') VALUES ('+ SQL.wild +')', SQL.value, function (SQLTransaction, SQLResultSet) {
          saveInstance.message = 'customer '+ saveInstance.customer_full_name +' added';
          saveInstance.customer_id = SQLResultSet.insertId;
          notify(saveInstance);
          callback(saveInstance, 202, null, null);
        }, function (SQLTransaction, error) {
          notify({message: 'customer full name already exists'});
          console.error(error);
        });
      });
    }
  };

  that.delete = function (tableName, paramKey, id, callback) {
    if ($rootScope.online) {
      $http.delete('api/'+ tableName +'/'+ id).success(function (data, status, headers, config) {
        that.getWebSQLdb().transaction(function (SQLTransaction) {yhngb
          SQLTransaction.executeSql('DELETE FROM '+ tableName +' WHERE '+ paramKey +'=?', [id], function (SQLTransaction, SQLResultSet) {
          }, function (SQLTransaction, error) {
            console.error(error);
          });
        });

        notify(data);
        callback(data, status, headers, config);
      }).error(errorHandler);
    } else {
      var data = {};
      that.getWebSQLdb().transaction(function (SQLTransaction) {
        SQLTransaction.executeSql('UPDATE '+ tableName +' set operation=? WHERE '+ paramKey +'=?', ['DELETE', id], function (SQLTransaction, SQLResultSet) {
          data = {'message': 'customer deleted'};
          notify(data);
          callback(data, 200, null, null);
        }, function (SQLTransaction, error) {
          console.error(error);
        });
      });
    }
  };

  return that;
}]);
