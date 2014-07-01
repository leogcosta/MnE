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

  // who-minus-who
  // all table variables live in the global scope
  $GLOBALS['TABLES'] = [
    CUSTOMERS => [
      'tableName' => 'customers',
      'tableSelect' => ['customer_id', 'customer_full_name', 'customer_phone_number', 'customer_email', 'customer_user_user_id'],
      'tableId' => 'customer_id',
      'getError' => 'customer does not exist',
      'collisionError' => 'customer constraint error',
      'newSuccess' => 'customer added successfully',
      'updateSuccess' => 'customer updated successfully',
      'deleteSuccess' => 'customer deleted',
      'deleteError' => 'error deleting customer'
    ],

    ACCOUNTS => [
      'tableName' => 'accounts',
      'tableSelect' => ['account_id', 'account_name', 'account_user_user_id'],
      'tableId' => 'account_id',
      'getError' => 'account does not exist',
      'collisionError' => 'account constraint error',
      'newSuccess' => 'account added successfully',
      'updateSuccess' => 'account updated successfully',
      'deleteSuccess' => 'account deleted',
      'deleteError' => 'error deleting account'
    ],

    ITEMS => [
      'tableName' => 'items',
      'tableSelect' => ['item_id', 'item_item_id', 'item_name', 'item_unit_price'],
      'tableId' => 'item_id',
      'getError' => 'item does not exist',
      'collisionError' => 'item constraint error',
      'newSuccess' => 'item added successfully',
      'updateSuccess' => 'item updated successfully',
      'deleteSuccess' => 'item deleted',
      'deleteError' => 'error deleting item'
    ]
  ];
?>
