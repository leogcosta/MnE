<?php
  /**
  * @author Moe Szyslak <moe.duffdude@gmail.com>
  */

  // time zone
  date_default_timezone_set('Africa/Addis_Ababa');

  // hash
  define('SALT', 's@1T'); // SALT to be used for the hashing (sha512)

  // cookie
  define('COOKIE_NAME', 'mne');
  define('COOKIE_AGE', 43200); // 12 Hours
  define('SECURE', FALSE);
  define('HTTP_ONLY', TRUE);

  // MySQL
  define('MYSQL_HOST', '127.0.0.1');
  define('MYSQL_USER', 'root');
  define('MYSQL_PASSWORD', 'password');
  define('MYSQL_DB_NAME', 'mne');

  // tables
  define('USERS', 'users');
  define('CUSTOMERS', 'CUSTOMERS');
  define('ACCOUNTS', 'ACCOUNTS');
  define('ITEMS', 'ITEMS');
  define('SALES', 'SALES');
  define('TRANSACTIONS', 'TRANSACTIONS');

  // who-minus-who
  // all table variables live in the global scope
  $GLOBALS['TABLES'] = [
    ACCOUNTS => [
      'tableName' => 'accounts',
      'tableSelect' => ['account_id',
                        'account_name',
                        'account_user_user_id',
                        'account_timestamp'],
      'tableId' => 'account_id',
      'timestamp' => 'account_timestamp',
      'getError' => 'account does not exist',
      'collisionError' => 'account constraint error',
      'newSuccess' => 'account added successfully',
      'updateSuccess' => 'account updated successfully',
      'deleteSuccess' => 'account deleted',
      'deleteError' => 'error deleting account'
    ],

    CUSTOMERS => [
      'tableName' => 'customers',
      'tableSelect' => ['customer_id',
                        'customer_full_name',
                        'customer_phone_number',
                        'customer_email',
                        'customer_user_user_id',
                        'customer_timestamp'],
      'tableId' => 'customer_id',
      'timestamp' => 'customer_timestamp',
      'getError' => 'customer does not exist',
      'collisionError' => 'customer constraint error',
      'newSuccess' => 'customer added successfully',
      'updateSuccess' => 'customer updated successfully',
      'deleteSuccess' => 'customer deleted',
      'deleteError' => 'error deleting customer'
    ],

    ITEMS => [
      'tableName' => 'items',
      'tableSelect' => ['item_id',
                        'item_item_id',
                        'item_name',
                        'item_unit_price',
                        'item_timestamp'],
      'tableId' => 'item_id',
      'timestamp' => 'item_timestamp',
      'getError' => 'item does not exist',
      'collisionError' => 'item constraint error',
      'newSuccess' => 'item added successfully',
      'updateSuccess' => 'item updated successfully',
      'deleteSuccess' => 'item deleted',
      'deleteError' => 'error deleting item'
    ],

    SALES => [
      'tableName' => 'sales',
      'tableSelect' => ['sale_id',
                        'sale_item_item_id',
                        'sale_item_quantity',
                        'sale_item_unit_price',
                        'sale_timestamp',
                        'sale_hold',
                        'sale_customer_customer_id',
                        'sale_user_user_id'],
      'tableId' => 'sale_id',
      'timestamp' => 'sale_timestamp',
      'getError' => 'sale does not exist',
      'collisionError' => 'sale constraint error',
      'newSuccess' => 'sale added successfully',
      'updateSuccess' => 'sale updated successfully',
      'deleteSuccess' => 'sale deleted',
      'deleteError' => 'error deleting sale'
    ],

    TRANSACTIONS => [
      'tableName' => 'transactions',
      'tableSelect' => ['transaction_id',
                        'transaction_type',
                        'transaction_amount',
                        'transaction_description',
                        'transaction_timestamp',
                        'transaction_account_account_id',
                        'transaction_user_user_id',
                        'trasaction_sale_sale_id',
                        'transaction_account_from_account_id'],
      'tableId' => 'transaction_id',
      'timestamp' => 'transaction_timestamp',
      'getError' => 'transaction does not exist',
      'collisionError' => 'transaction constraint error',
      'newSuccess' => 'transaction added successfully',
      'updateSuccess' => 'transaction updated successfully',
      'deleteSuccess' => 'transaction deleted',
      'deleteError' => 'error deleting transaction'
    ]
  ];
?>
