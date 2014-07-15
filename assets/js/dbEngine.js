// this is a `fake` database engine we're going to be using to handle all
// persistent storage plans, it's not going to be generic to Angular's motto of
// reusable services is out the window like THAT - sorry MASTER!
//
// am not going to be using the REST services provided by Angular since it's `hard`
// to handle errors without intercepting or something (without INTERCEPTION)
var dbEngine = angular.module('dbEngine', []);

dbEngine.factory('dbEngine2', ['$rootScope', '$q', '$http', function ($rootScope, $q, $http) {
  // this is the `closure` that's going to be returned
  var that = {
    webdb: {
      db: null,
      size: 5242880, // that's 5MB right there - 5*1024*1024
      sql: {
        customers: 'CREATE TABLE IF NOT EXISTS customers ('+
                        'customer_id INTEGER PRIMARY KEY ASC,'+
                        'customer_full_name VARCHAR UNIQUE COLLATE NOCASE,'+
                        'customer_phone_number VARCHAR,'+
                        'customer_email VARCHAR,'+
                        'customer_user_user_id INTEGER,'+
                        'operation VARCHAR,'+
                        'customer_timestamp TIMESTAMP DEFAULT (datetime(\'now\',\'unixepoch\')));',

        items: 'CREATE TABLE IF NOT EXISTS items ('+
                        'item_id INTEGER PRIMARY KEY ASC,'+
                        'item_item_id VARCHAR UNIQUE COLLATE NOCASE,'+
                        'item_name VARCHAR,'+
                        'item_unit_price DECIMAL(10,3),'+
                        'operation VARCHAR,'+
                        'item_timestamp TIMESTAMP DEFAULT (datetime(\'now\',\'unixepoch\')));',

        accounts: 'CREATE TABLE IF NOT EXISTS accounts ('+
                        'account_id INTEGER PRIMARY KEY ASC,'+
                        'account_name VARCHAR UNIQUE COLLATE NOCASE,'+
                        'account_user_user_id INTEGER,'+
                        'operation VARCHAR,'+
                        'account_timestamp TIMESTAMP DEFAULT (datetime(\'now\',\'unixepoch\')));',

        sales:   'CREATE TABLE IF NOT EXISTS sales ('+
                        'sale_id INTEGER PRIMARY KEY ASC,'+
                        'sale_item_item_id INTEGER,'+
                        'sale_item_quantity INTEGER,'+
                        'sale_item_unit_price DECIMAL(10,3),'+
                        'sale_timestamp TIMESTAMP DEFAULT (datetime(\'now\',\'unixepoch\')),'+
                        'sale_hold DECIMAL(10,3),'+
                        'sale_customer_customer_id INTEGER,'+
                        'sale_user_user_id INTEGER,'+
                        'operation VARCHAR);',

        transactions: 'CREATE TABLE IF NOT EXISTS transactions ('+
                        'transaction_id INTEGER PRIMARY KEY ASC,'+
                        'transaction_type VARCHAR,'+
                        'transaction_amount DECIMAL(10,3),'+
                        'transaction_description TEXT,'+
                        'transaction_timestamp TIMESTAMP DEFAULT (datetime(\'now\',\'unixepoch\')),'+
                        'transaction_account_account_id INTEGER,'+
                        'transaction_user_user_id INTEGER,'+
                        'trasaction_sale_sale_id INTEGER,'+
                        'transaction_account_from_account_id INTEGER,'+
                        'operation VARCHAR);'
      },

      keys: {
        customers: {
          primaryKey: 'customer_id',
          selectKey: 'customer_id, customer_full_name, customer_phone_number, customer_email, customer_user_user_id, customer_timestamp, operation',
          timestamp: 'customer_timestamp',
          number: ['customer_id', 'customer_user_user_id']
        },

        items: {
          primaryKey: 'item_id',
          selectKey: 'item_id, item_item_id, item_name, item_unit_price, item_timestamp, operation',
          timestamp: 'item_timestamp',
          number: ['item_id', 'item_unit_price']
        },

        accounts: {
          primaryKey: 'account_id',
          selectKey: 'account_id, account_name, account_user_user_id, account_timestamp, operation',
          timestamp: 'account_timestamp',
          number: ['account_id', 'account_user_user_id']
        },

        sales: {
          primaryKey: 'sale_id',
          selectKey: 'sale_id, sale_item_item_id, sale_item_quantity, sale_item_unit_price, sale_timestamp, sale_hold, sale_customer_customer_id, sale_user_user_id, operation',
          timestamp: 'sale_timestamp',
          number: ['sale_id', 'sale_item_item_id', 'sale_item_quantity', 'sale_item_unit_price', 'sale_hold', 'sale_customer_customer_id', 'sale_user_user_id']
        },

        transactions: {
          primaryKey: 'transaction_id',
          selectKey: 'transaction_id, transaction_type, transaction_amount, transaction_description, transaction_timestamp, transaction_account_account_id, transaction_user_user_id, trasaction_sale_sale_id, transaction_account_from_account_id, operation',
          timestamp: 'transaction_timestamp',
          number: ['transaction_id', 'transaction_amount', 'transaction_account_account_id', 'transaction_user_user_id', 'trasaction_sale_sale_id', 'transaction_account_from_account_id']
        }
      }
    }
  };

  // this is our generic error hander
  // it's called ERYtime a promise is broken
  // i wouldn't wanna be that guy
  var promiseBroken = function (error) {
    console.error(error);
  };



  var SQLErrorHandeler = function (SQLTransaction, error) {
    // the error message returned is different on browsers i.e.
    // Chrome and Safari - some day we come one --- na, that would be boring!
    //
    // any who, the error message is tailored to iOS, like i said
    // the app is optimized for iOS, for a different agent you can log the error
    // and tailor it to yourself
    if (error.message.search(/not unique/i) !== -1) {
      notify({message: 'unique constraint failure'});
    }

    console.error(error);
  };



  // and this is called whenever a server returns a non-success
  // response header
  var HTTPerrorHandler = function (data, status, headers, config) {
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
  };



  // open it up
  // like a slut opens her legs --- BOOM!
  that.webdb.open = function () {
    var deferred = $q.defer();

    try {
      that.webdb.db = openDatabase('mne', '1.0', 'MnE Database', that.webdb.size);
      deferred.resolve('"MnE" database opened without a glitch');
    } catch (e) {
      deferred.reject(e.message);
    }

    return deferred.promise;
  };



  // executes the SQL inside webdb.sql
  that.webdb.initiateTable = function (tableName) {
    var deferred = $q.defer();

    that.webdb.db.transaction(function (SQLTransaction) {
      SQLTransaction.executeSql(that.webdb.sql[tableName], [], function (SQLTransaction, SQLResultSet) {
        deferred.resolve('"'+ tableName + '" sql executed without a glitch');
      }, function (SQLTransaction, error) {
        deferred.reject(error);
      });
    });

    return deferred.promise;
  };



  // am making the pyramid --- how can i avoid the pyramid i wonder....
  // that is one fine looking pyramid right there!
  that.webdb.initiateTables = function () {
    var deferred = $q.defer();

    // customers
    that.webdb.initiateTable('customers').then(function (message) {
      console.log(message);
      // items
      that.webdb.initiateTable('items').then(function (message) {
        console.log(message);
        // accounts
        that.webdb.initiateTable('accounts').then(function (message) {
          console.log(message);
          // sales
          that.webdb.initiateTable('sales').then(function (message) {
            console.log(message);
            // transactions
            that.webdb.initiateTable('transactions').then(function (message) {
              console.log(message);
              deferred.resolve('hurray, ALL table\'s SQL executed without a glitch');
            }, promiseBroken);
          }, promiseBroken);
        }, promiseBroken);
      }, promiseBroken);
    }, promiseBroken);

    return deferred.promise;
  };



  // and comes the CRUD
  // @param tableName - table name
  // @param id - id of resource to be returned
  that.get = function (tableName, id, callback) {
    if ($rootScope.online === true && $rootScope.syncMode === false) {
      $http.get('api/'+ tableName +'/'+ id).success(function (data, status, headers, config) {
        // appropriate type conversion
        // timestamps and numbers get converted
        delete data['$$hashKey'];
        data[that.webdb.keys[tableName].timestamp] = moment(data[that.webdb.keys[tableName].timestamp], 'YYYY-MM-DD HH:mm:ss')._i;
        for (index in that.webdb.keys[tableName].number) {
          if (isNaN(data[that.webdb.keys[tableName].number[index]]) === true) {
            data[that.webdb.keys[tableName].number[index]] = '';
          } else {
            data[that.webdb.keys[tableName].number[index]] = Number(data[that.webdb.keys[tableName].number[index]]);
          }
        }

        callback(data, status, headers, config);

        // `AFTER` returning we see to check the `fetched` data
        // exits in the local database --- if it doesn't we add it
        that.webdb.db.transaction(function (SQLTransaction) {
          SQLTransaction.executeSql('SELECT '+ that.webdb.keys[tableName].selectKey +' FROM '+ tableName +' WHERE '+ that.webdb.keys[tableName].primaryKey +' = ?', [id], function (SQLTransaction, SQLResultSet) {
            // well what do you know, the newly fetched row
            // does not exist in the local db, so since it's 'new'
            // we'll sync it with `no preconditions`

            data.operation = '';

            if (SQLResultSet.rows.length === 0) {
              console.log('adding to WebSQL...');
              delete data['$$hashKey'];

              var sql = {
                wild: [],
                value: [],
                key: Object.keys(data)
              };

              for (key in sql.key) {
                sql.wild.push('?');
                sql.value.push(data[sql.key[key]] === null ? '' : data[sql.key[key]]);
              }

              sql.wild = sql.wild.join(', ');

              SQLTransaction.executeSql('INSERT INTO '+ tableName +' ('+ sql.key.join(', ') +') VALUES ('+ sql.wild +')', sql.value, function (SQLTransaction, SQLResultSet) {
                console.log('added to WebSQL');
              }, SQLErrorHandeler);
            } else {
              // we have `existence` of the record, we compare the last operation timestamp
              // to figure out weather or not we need to sync here or to the server
              // we're assuming the latest operation timestamp is the shit

              // sever has the latest `version` of this data
              var diff = moment(data[that.webdb.keys[tableName].timestamp], 'YYYY-MM-DD HH:mm:ss').diff(moment(SQLResultSet.rows.item(0)[that.webdb.keys[tableName].timestamp], 'YYYY-MM-DD HH:mm:ss'));
              if (diff > 0) {
                console.log('server has the latest `version`');
                delete data['$$hashKey'];

                var sql = {
                  set: [],
                  value: []
                };

                for (key in data) {
                  sql.set.push(key +' = ?');
                  sql.value.push(data[key] === null ? '' : data[key]);
                }

                sql.set = sql.set.join(', ');
                sql.set += ' WHERE '+ that.webdb.keys[tableName].primaryKey +' = ?';
                sql.value.push(data[that.webdb.keys[tableName].primaryKey]);

                SQLTransaction.executeSql('UPDATE '+ tableName +' SET '+ sql.set, sql.value, function (SQLTransaction, SQLResultSet) {
                  console.log('GET synced');
                }, SQLErrorHandeler);
              } else if (diff < 0) {
                console.log('local has the latest version');
                console.log('pushing to server...');
                $http.put('api/'+ tableName +'/'+ data[that.webdb.keys[tableName].primaryKey], SQLResultSet.rows.item(0)).success(function (data, status, headers, config) {
                  console.log('changes have been successfully pushed to server');
                  notify({message: 'GET synced'});
                }).error(HTTPerrorHandler);
              } else {
                console.log('phew, everything seems to be "in-place"');
              }
            }
          }, SQLErrorHandeler);
        });
      }).error(HTTPerrorHandler);
    } else {
      // we immediately `free` the `lock` on syncMode
      // just in-case `this` is called from the syncEngine
      $rootScope.syncMode = false;

      // we are offline --- pray to MeganFox there exits a record
      that.webdb.db.transaction(function (SQLTransaction) {
        SQLTransaction.executeSql('SELECT '+ that.webdb.keys[tableName].selectKey +' FROM '+ tableName +' WHERE '+ that.webdb.keys[tableName].primaryKey +' = ?', [id], function (SQLTransaction, SQLResultSet) {
          // there should be ONLY one returned
          // or YOU did something wrong
          if (SQLResultSet.rows.length === 1) {
            // we have send back the copied version --- since the returned one
            // is protected
            var data = angular.copy(SQLResultSet.rows.item(0));
            data[that.webdb.keys[tableName].timestamp] = moment(data[that.webdb.keys[tableName].timestamp], 'YYYY-MM-DD HH:mm:ss')._i;
            for (index in that.webdb.keys[tableName].number) {
              if (isNaN(data[that.webdb.keys[tableName].number[index]]) === true) {
                data[that.webdb.keys[tableName].number[index]] = '';
              } else {
                data[that.webdb.keys[tableName].number[index]] = Number(data[that.webdb.keys[tableName].number[index]]);
              }
            }

            callback(data, null, null, null);
          } else {
            notify({message: 'whoops, i can\'t do *that*'});
          }
        }, SQLErrorHandeler);
      }, SQLErrorHandeler);
    }
  };



  // yep this fetches ERYthing and returns it - nothing "fancy"
  // or should it --- i think it should ASAP --- fancy it is!
  that.query = function (tableName, callback) {
    if ($rootScope.online === true && $rootScope.syncMode === false) {
      $http.get('api/'+ tableName).success(function (data, status, headers, config) {
        for(row in data) {
          delete data[row]['$$hashKey'];
          data[row][that.webdb.keys[tableName].timestamp] = moment(data[row][that.webdb.keys[tableName].timestamp], 'YYYY-MM-DD HH:mm:ss')._i;

          for (index in that.webdb.keys[tableName].number) {
            if (isNaN(data[row][that.webdb.keys[tableName].number[index]]) === true) {
              data[row][that.webdb.keys[tableName].number[index]] = '';
            } else {
              data[row][that.webdb.keys[tableName].number[index]] = Number(data[row][that.webdb.keys[tableName].number[index]]);
            }
          }
        }

        callback(data, status, headers, config);

        // what this `check` is basically does what get does
        this.check = function (data) {
          that.webdb.db.transaction(function (SQLTransaction) {
            SQLTransaction.executeSql('SELECT '+ that.webdb.keys[tableName].selectKey +' FROM '+ tableName +' WHERE '+ that.webdb.keys[tableName].primaryKey +' = ?', [data[that.webdb.keys[tableName].primaryKey]], function (SQLTransaction, SQLResultSet) {
              if (SQLResultSet.rows.length === 1) {
                var diff = moment(data[that.webdb.keys[tableName].timestamp], 'YYYY-MM-DD HH:mm:ss').diff(moment(SQLResultSet.rows.item(0)[that.webdb.keys[tableName].timestamp], 'YYYY-MM-DD HH:mm:ss'));
                if (diff > 0) {
                  console.log('server has the latest `version`');
                  delete data['$$hashKey'];

                  var sql = {
                    set: [],
                    value: []
                  };

                  for (key in data) {
                    // i don't know where this $$hashKey is coming from
                    // but it's very meeeebad --- meeeekay
                    sql.set.push(key +' = ?');
                    sql.value.push(data[key] === null ? '' : data[key]);
                  }

                  sql.set = sql.set.join(', ');
                  sql.set += ' WHERE '+ that.webdb.keys[tableName].primaryKey +' = ?';
                  sql.value.push(data[that.webdb.keys[tableName].primaryKey]);

                  SQLTransaction.executeSql('UPDATE '+ tableName +' SET '+ sql.set, sql.value, function (SQLTransaction, SQLResultSet) {
                    console.log('GET synced');
                  }, SQLErrorHandeler);
                } else if (diff < 0) {
                  console.log('local has the latest version');
                  console.log('pushing to server...');
                  $http.put('api/'+ tableName +'/'+ data[that.webdb.keys[tableName].primaryKey], SQLResultSet.rows.item(0)).success(function (data, status, headers, config) {
                    // we won't be notifying here since there might be
                    // one too many
                    console.log('changes have been successfully pushed to server');
                  }).error(HTTPerrorHandler);
                }
              } else if (SQLResultSet.rows.length === 0) {
                console.log('adding to WebSQL...');
                delete data['$$hashKey'];

                var sql = {
                  wild: [],
                  value: [],
                  key: Object.keys(data)
                };

                for (key in sql.key) {
                  sql.wild.push('?');
                  sql.value.push(data[sql.key[key]] === null ? '' : data[sql.key[key]]);
                }

                sql.wild = sql.wild.join(', ');

                SQLTransaction.executeSql('INSERT INTO '+ tableName +' ('+ sql.key.join(', ') +') VALUES ('+ sql.wild +')', sql.value, function (SQLTransaction, SQLResultSet) {
                  console.log('added to WebSQL');
                }, SQLErrorHandeler);
              }
            }, SQLErrorHandeler);
          }, SQLErrorHandeler);
        }

        // now comes the fancy part
        // we'll look through each data to see if ERYthing is in sync
        // if not we make it sync
        // now this is where the `fancy` part comes in play
        // there are no promises here ---
        // just hope everything goes according to `plan`
        var reverseIndex = []; // will be used for reveres *cleaning*
        for (index in data) {
          data[index].operation = '';
          reverseIndex.push(data[index][that.webdb.keys[tableName].primaryKey]);
          this.check(data[index]);
        }

        // after 5 seconds (which is more than enough + we're not in a hurry)
        // we'll go through the local db record and `delete` stuff that's
        // *just* hanging around
        //
        // PS
        // i did not go in to the promise and stuff --- yep it's that
        // lazy moment --- very un-German
        setTimeout(function () {
          console.log('spring cleaning...');

          that.webdb.db.transaction(function (SQLTransaction) {
            SQLTransaction.executeSql('SELECT '+ that.webdb.keys[tableName].selectKey +' FROM '+ tableName, [], function (SQLTransaction, SQLResultSet) {
              var i = 0, l = SQLResultSet.rows.length, data = [];

              for (; i < l; i++) {
                var row = angular.copy(SQLResultSet.rows.item(i));
                if (reverseIndex.indexOf(row[that.webdb.keys[tableName].primaryKey]) === -1 && (row.operation === '' || row.operation === null)) {
                  SQLTransaction.executeSql('DELETE FROM '+ tableName +' WHERE '+ that.webdb.keys[tableName].primaryKey +' = ?', [row[that.webdb.keys[tableName].primaryKey]], function (SQLTransaction, SQLResultSet) {
                    if ((i + 1) === l) {
                      console.log('spring cleaning DON!');
                    }
                  }, SQLErrorHandeler);
                } else if ((i + 1) === l) {
                  console.log('spring cleaning DON!');
                }
              }

              if (l === 0) {
                console.log('this is wired, still NO spring cleaning!');
              }
            }, SQLErrorHandeler);
          }, SQLErrorHandeler);
        }, 5000);
      }).error(HTTPerrorHandler);
    } else {
      $rootScope.syncMode = false;

      // nothing fancy here
      // returning from webSQL
      that.webdb.db.transaction(function (SQLTransaction) {
        SQLTransaction.executeSql('SELECT '+ that.webdb.keys[tableName].selectKey +' FROM '+ tableName, [], function (SQLTransaction, SQLResultSet) {
          var i = 0, l = SQLResultSet.rows.length, data = [];
          for (; i < l; i++) {
            var row = angular.copy(SQLResultSet.rows.item(i));
            row[that.webdb.keys[tableName].timestamp] = moment(row[that.webdb.keys[tableName].timestamp], 'YYYY-MM-DD HH:mm:ss')._i;

            for (index in that.webdb.keys[tableName].number) {
              if (isNaN(row[that.webdb.keys[tableName].number[index]]) === true) {
                row[that.webdb.keys[tableName].number[index]] = '';
              } else {
                row[that.webdb.keys[tableName].number[index]] = Number(row[that.webdb.keys[tableName].number[index]]);
              }
            }

            data.push(row);
          }

          callback(data, null, null, null);
        }, SQLErrorHandeler);
      }, SQLErrorHandeler);
    }
  };



  that.save = function (tableName, instance, callback) {
    if ($rootScope.online === true && $rootScope.syncMode === false) {
      // we send it to server, and see what it has to say about that
      // i.e. we have our lawdy validation-god
      $http.post('api/'+ tableName, instance).success(function (data, status, headers, config) {
        data[that.webdb.keys[tableName].timestamp] = moment(data[that.webdb.keys[tableName].timestamp], 'YYYY-MM-DD HH:mm:ss')._i;
        for (index in that.webdb.keys[tableName].number) {
          if (isNaN(data[that.webdb.keys[tableName].number[index]]) === true) {
            data[that.webdb.keys[tableName].number[index]] = '';
          } else {
            data[that.webdb.keys[tableName].number[index]] = Number(data[that.webdb.keys[tableName].number[index]]);
          }
        }

        notify({message: 'saved'});
        callback(data, status, headers, config);

        // since new data is returned we save it to WebSQL
        // without any preconditions --- BUT there might be an offline
        // data lurking somewhere, we just hope that isn't the case
        console.log('adding to WebSQL...');

        delete data.message;
        delete data['$$hashKey'];
        data.operation = '';

        var sql = {
          wild: [],
          value: [],
          key: Object.keys(data)
        };

        for (key in sql.key) {
          sql.wild.push('?');
          sql.value.push(data[sql.key[key]] === null ? '' : data[sql.key[key]]);
        }

        sql.wild = sql.wild.join(', ');

        that.webdb.db.transaction(function (SQLTransaction) {
          SQLTransaction.executeSql('INSERT INTO '+ tableName +' ('+ sql.key.join(', ') +') VALUES ('+ sql.wild +')', sql.value, function (SQLTransaction, SQLResultSet) {
            console.log('added to WebSQL');
          }, SQLErrorHandeler);
        }, SQLErrorHandeler);
      }).error(HTTPerrorHandler);
    } else {
      $rootScope.syncMode = false;

      // we change the operation mode
      // and it'll be synced once online
      console.log('adding to WebSQL...');

      instance.operation = 'SAVE';
      delete instance['$$hashKey'];

      // depending on the table name
      // we're going to be setting some values
      switch (tableName) {
        case 'accounts':
          instance.account_timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
          instance.account_user_user_id = localStorage.user_id;
        break;

        case 'customers':
          instance.customer_timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
          instance.customer_user_user_id = localStorage.user_id;
        break;

        case 'items':
          instance.item_timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
        break;

        case 'sales':
          instance.sale_timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
          instance.sale_user_user_id = localStorage.user_id;
        break;

        case 'transactions':
          instance.transaction_timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
          instance.transaction_user_user_id = localStorage.user_id;
        break;
      }

      var sql = {
        wild: [],
        value: [],
        key: Object.keys(instance)
      };

      for (key in sql.key) {
        sql.wild.push('?');
        sql.value.push(instance[sql.key[key]] === null ? '' : instance[sql.key[key]]);
      }

      sql.wild = sql.wild.join(', ');

      that.webdb.db.transaction(function (SQLTransaction) {
        SQLTransaction.executeSql('INSERT INTO '+ tableName +' ('+ sql.key.join(', ') +') VALUES ('+ sql.wild +')', sql.value, function (SQLTransaction, SQLResultSet) {
          console.log('added to WebSQL');
          notify({message: 'saved'});
          instance[that.webdb.keys[tableName].primaryKey] = SQLResultSet.insertId;

          instance[that.webdb.keys[tableName].timestamp] = moment(instance[that.webdb.keys[tableName].timestamp], 'YYYY-MM-DD HH:mm:ss')._i;
          for (index in that.webdb.keys[tableName].number) {
            if (isNaN(instance[that.webdb.keys[tableName].number[index]]) === true) {
              instance[that.webdb.keys[tableName].number[index]] = '';
            } else {
              instance[that.webdb.keys[tableName].number[index]] = Number(instance[that.webdb.keys[tableName].number[index]]);
            }
          }

          callback(instance, null, null, null);
        }, SQLErrorHandeler);
      }, SQLErrorHandeler);
    }
  };



  // on update - PK stays the same, there's no updating that son
  // also some keys of an object will not change through
  // the lifetime of the instance
  that.update = function (tableName, instance, callback) {
    if ($rootScope.online === true && $rootScope.syncMode === false) {
      // we're going to do something fancy here --- watch-out shufer! watch-out
      $http.put('api/'+ tableName +'/'+ instance[that.webdb.keys[tableName].primaryKey], instance).success(function (data, status, headers, config) {
        data[that.webdb.keys[tableName].timestamp] = moment(data[that.webdb.keys[tableName].timestamp], 'YYYY-MM-DD HH:mm:ss')._i;
        for (index in that.webdb.keys[tableName].number) {
          if (isNaN(data[that.webdb.keys[tableName].number[index]]) === true) {
            data[that.webdb.keys[tableName].number[index]] = '';
          } else {
            data[that.webdb.keys[tableName].number[index]] = Number(data[that.webdb.keys[tableName].number[index]]);
          }
        }

        // there's a `latest` version that isn't merged with the
        // local db, so we merge the shit out of it
        if (data.hasOwnProperty('merge') === true) {
          console.log('merging..');
          delete data.merge;
          delete data['$$hashKey'];
          data.operation = 'MERGE';

          that.webdb.db.transaction(function (SQLTransaction) {
            var sql = {
              set: [],
              value: []
            };

            for (key in data) {
              sql.set.push(key +' = ?');
              sql.value.push(data[key] === null ? '' : data[key]);
            }

            sql.set = sql.set.join(', ');
            sql.set += ' WHERE '+ that.webdb.keys[tableName].primaryKey +' = ?';
            sql.value.push(data[that.webdb.keys[tableName].primaryKey]);

            SQLTransaction.executeSql('UPDATE '+ tableName +' SET '+ sql.set, sql.value, function (SQLTransaction, SQLResultSet) {
              notify({message: 'merge sync'});
              console.log('DON merging!');
              callback(data, status, headers, config);
            }, SQLErrorHandeler);
          }, SQLErrorHandeler);
        } else {
          notify({message: 'updated'});
          callback(data, status, headers, config);
          delete data.message;
          delete data['$$hashKey'];
          // this clears out whatever operation was left, if any
          data.operation = '';

          // my god this fixes a HUGE ass bug
          that.webdb.db.transaction(function (SQLTransaction) {
            var sql = {
              set: [],
              value: []
            };

            for (key in data) {
              sql.set.push(key +' = ?');
              sql.value.push(data[key] === null ? '' : data[key]);
            }

            sql.set = sql.set.join(', ');
            sql.set += ' WHERE '+ that.webdb.keys[tableName].primaryKey +' = ?';
            sql.value.push(data[that.webdb.keys[tableName].primaryKey]);

            SQLTransaction.executeSql('UPDATE '+ tableName +' SET '+ sql.set, sql.value, function (SQLTransaction, SQLResultSet) {
              console.log('silent update on ['+ tableName +'] went without a glitch')
            }, SQLErrorHandeler);
          }, SQLErrorHandeler);
        }
      }).error(HTTPerrorHandler);
    } else {
      $rootScope.syncMode = false;

      // we will not be checking for existence --- because the 'instance'
      // must exist in the first place to be edited here --- BUT there
      // is a `situation` where this logic would fail, let the system have
      // a hole :)
      instance.operation = 'UPDATE';
      delete instance['$$hashKey'];

      switch (tableName) {
        case 'accounts':
          instance.account_timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
          delete instance.account_user_user_id;
        break;

        case 'customers':
          instance.customer_timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
          delete instance.customer_user_user_id;
        break;

        case 'items':
          instance.item_timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
        break;

        case 'sales':
          instance.sale_timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
          delete instance.sale_user_user_id;
        break;

        case 'transactions':
          instance.transaction_timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
          delete instance.transaction_user_user_id;
        break;
      }

      var sql = {
        set: [],
        value: []
      };

      for (key in instance) {
        sql.set.push(key +' = ?');
        sql.value.push(instance[key] === null ? '' : instance[key]);
      }

      sql.set = sql.set.join(', ');
      sql.set += ' WHERE '+ that.webdb.keys[tableName].primaryKey +' = ?';
      sql.value.push(instance[that.webdb.keys[tableName].primaryKey]);

      that.webdb.db.transaction(function (SQLTransaction) {
        SQLTransaction.executeSql('UPDATE '+ tableName +' SET '+ sql.set, sql.value, function (SQLTransaction, SQLResultSet) {

          instance[that.webdb.keys[tableName].timestamp] = moment(instance[that.webdb.keys[tableName].timestamp], 'YYYY-MM-DD HH:mm:ss')._i;
          for (index in that.webdb.keys[tableName].number) {
            if (isNaN(instance[that.webdb.keys[tableName].number[index]]) === true) {
              instance[that.webdb.keys[tableName].number[index]] = '';
            } else {
              instance[that.webdb.keys[tableName].number[index]] = Number(instance[that.webdb.keys[tableName].number[index]]);
            }
          }

          notify({message: 'updated'});
          callback(instance, null, null, null);
        }, SQLErrorHandeler);
      }, SQLErrorHandeler);
    }
  };



  that.delete = function (tableName, instance, callback) {
    if ($rootScope.online === true && $rootScope.syncMode === false) {
      var url = that.webdb.keys[tableName].hasOwnProperty('timestamp') === true ?
                'api/'+ tableName +'/'+ instance[that.webdb.keys[tableName].primaryKey] +'/'+ instance[that.webdb.keys[tableName].timestamp] :
                'api/'+ tableName +'/'+ instance[that.webdb.keys[tableName].primaryKey];

      $http.delete(url).success(function (data, status, headers, config) {
        // there's a `latest` version that isn't merged with the
        // local db, so we merge the shit out of it
        if (data.hasOwnProperty('merge') === true) {
          console.log('merging..');
          delete data.merge;
          delete data['$$hashKey'];
          data.operation = 'MERGE';

          that.webdb.db.transaction(function (SQLTransaction) {
            var sql = {
              set: [],
              value: []
            };

            for (key in data) {
              sql.set.push(key +' = ?');
              sql.value.push(data[key] === null ? '' : data[key]);
            }

            sql.set = sql.set.join(', ');
            sql.set += ' WHERE '+ that.webdb.keys[tableName].primaryKey +' = ?';
            sql.value.push(data[that.webdb.keys[tableName].primaryKey]);

            SQLTransaction.executeSql('UPDATE '+ tableName +' SET '+ sql.set, sql.value, function (SQLTransaction, SQLResultSet) {
              notify({message: 'merge sync'});
              callback(data, status, headers, config);
            }, SQLErrorHandeler);
          }, SQLErrorHandeler);
        } else {
          notify(data);
          callback(data, status, headers, config);

          console.log('deleting from local db too...');
          that.webdb.db.transaction(function (SQLTransaction) {
            var sql = {
              value: [instance[that.webdb.keys[tableName].primaryKey]]
            };

            SQLTransaction.executeSql('DELETE FROM '+ tableName +' WHERE '+ that.webdb.keys[tableName].primaryKey +' = ?', sql.value, function (SQLTransaction, SQLResultSet) {
              console.log('deletion from local db went without a glitch');
            }, SQLErrorHandeler);
          }, SQLErrorHandeler);
        }
      }).error(HTTPerrorHandler);
    } else {
      $rootScope.syncMode = false;

      // we will "delete" the data BUT (ohhhh, here we go) the **REAL**
      // deletion will take place once online and 'verified' by the server
      var sql = {
        set: 'operation = ? WHERE '+ that.webdb.keys[tableName].primaryKey + ' = ?;',
        value: ['DELETE', instance[that.webdb.keys[tableName].primaryKey]]
      };

      that.webdb.db.transaction(function (SQLTransaction) {
        SQLTransaction.executeSql('UPDATE '+ tableName +' SET '+ sql.set, sql.value, function (SQLTransaction, SQLResultSet) {
          notify({message: 'deleted'});
          callback({}, null, null, null);
        }, SQLErrorHandeler);
      }, SQLErrorHandeler);
    }
  };



  return that;
}]);
