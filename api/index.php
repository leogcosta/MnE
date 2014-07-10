<?php
  require_once('../config.php'); // configuration variables
  require_once('../lib/medoo.php'); // light database engine (medoo.in)
  require_once('../lib/utils.php'); // utilities function
  require_once('../lib/dbQuery.php'); // db Query functions
  require_once('../lib/flight/Flight.php'); // and finally Flight (used for `routing`)

  require_once('../scripts/login.php');
  require_once('../scripts/customers.php');
  require_once('../scripts/items.php');
  require_once('../scripts/accounts.php');
  require_once('../scripts/sales.php');
  require_once('../scripts/transactions.php');

  require_once('../scripts/sync.php');
  start_session();
  verify_xsrf();

  // Error, and it's a big one
  // and lets be honest, & am repeating myself here, which i usually don't do ;)
  // has there been a better use for Justin Bieber than *THIS*
  Flight::map('error', function (Exception $ex) {
    Flight::json(['message' => $ex -> getMessage()], 500);
  });

  // Login
  Flight::route('GET /login', 'login_GET');
  Flight::route('POST /login', 'login_POST');
  Flight::route('DELETE /login', 'login_DELETE');

  // Customers
  Flight::route('GET /customers(/@id)', 'customer_GET');
  Flight::route('POST /customers', 'customer_POST');
  Flight::route('PUT /customers/@id', 'customer_PUT');
  Flight::route('DELETE /customers/@id(/@timesatmp)', 'customer_DELETE');

  // Item
  Flight::route('GET /items(/@id)', 'item_GET');
  Flight::route('POST /items', 'item_POST');
  Flight::route('PUT /items/@id', 'item_PUT');
  Flight::route('DELETE /items/@id(/@timesatmp)', 'item_DELETE');

  // Account
  Flight::route('GET /accounts(/@id)', 'account_GET');
  Flight::route('POST /accounts', 'account_POST');
  Flight::route('PUT /accounts/@id', 'account_PUT');
  Flight::route('DELETE /accounts/@id(/@timesatmp)', 'account_DELETE');

  // Sales
  Flight::route('GET /sales(/@id)', 'sale_GET');
  Flight::route('POST /sales', 'sale_POST');
  Flight::route('PUT /sales/@id', 'sale_PUT');
  Flight::route('DELETE /sales/@id(/@timesatmp)', 'sale_DELETE');

  // Transactions
  Flight::route('GET /transactions(/@id)', 'transaction_GET');
  Flight::route('POST /transactions', 'transaction_POST');
  Flight::route('PUT /transactions/@id', 'transaction_PUT');
  Flight::route('DELETE /transactions/@id(/@timesatmp)', 'transaction_DELETE');

  // sync
  Flight::route('POST /sync/@table', 'syncTable');

  Flight::start();
?>
