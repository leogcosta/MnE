// this is a `fake` database engine we're going to be using to handle all
// persistent storage plans, it's not going to be generic to Angular's motto of
// reusable services is out the window like THAT - sorry MASTER!
//
// am not going to be using the REST services provided by Angular since it's `hard`
// to handle errors without intercepting or something (without INTERCEPTION)
var dbEngine = angular.module('dbEngine', []);
dbEngine.factory('dbEngine', ['$rootScope', '$http', '$location', function ($rootScope, $http, $location) {
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

    /*
    that.WebSQL.db.transaction(function (SQLTransaction) {
      SQLTransaction.executeSql('INSERT INTO customers (customer_full_name, customer_phone_number, customer_email, customer_user_user_id) VALUES (?, ?, ?, ?)', ['Moe Szyslak', '0912444676', 'moe.duffdude@gmail.com', localStorage.user_id], function (SQLTransaction, SQLResultSet) {
        console.log(SQLTransaction);
        console.log(SQLResultSet);
      }, function (SQLTransaction, error) {
        console.log(error);
      });
    });
    */

    /*
    that.WebSQL.db.transaction(function (SQLTransaction) {
      SQLTransaction.executeSql('SELECT customer_id, customer_full_name, customer_phone_number, customer_email, customer_user_user_id FROM customers', [], function (SQLTransaction, SQLResultSet) {
        console.log(SQLTransaction);
        console.log(SQLResultSet);

        // fetching...
        for (var i = 0; i < SQLResultSet.rows.length; i++) {
          console.log(SQLResultSet.rows.item(i));
        }
      });
    });
    */

    /*
    that.WebSQL.db.transaction(function (SQLTransaction) {
      SQLTransaction.executeSql('DROP TABLE customers', [], function (SQLTransaction, SQLResultSet) {
        console.log('DELETE');
        console.log(SQLTransaction);
        console.log(SQLResultSet);
      }, that.WebSQL.onError());
    });
    */
  };

  that.get = function (tableName, id, callback) {
    if ($rootScope.online) {
      var SQL = {
        selectKey: '',
        primaryKey: '',
        value: [],
        wild: []
      };

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
      }).error(function (data, status, headers, config) {
        notify(data);
        console.log(data);
      });
    } else {
    }
  };



  that.query = function (tableName, callback) {
    if ($rootScope.online) {
      $http.get('api/'+ tableName).success(function (data, status, headers, config) {
        callback(data, status, headers, config);
      }).error(function (data, status, headers, config) {
        notify(data);
        console.log(data);
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

    if ($rootScope.online) {
      $http.post('api/'+ tableName, saveInstance).success(function (data, status, headers, config) {
        notify(data);
        callback(data, status, headers, config);
      }).error(function (data, status, headers, config) {
        switch(status) {
          case 412:
            notify(data);
            setTimeout(function () {
              document.location.href = window.location.origin + window.location.pathname;
            }, 3000);
          break;

          // conflict on constraints
          case 409:
            notify(data);
          break;

          default:
          break
        }
      });
    }
  };

  return that;
}]);
