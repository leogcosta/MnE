<?php
  require_once('../config.php'); // configuration variables
  require_once('../lib/medoo.php'); // light database engine (medoo.in)
  require_once('../lib/utils.php'); // utilities function
  require_once('../lib/flight/Flight.php'); // and finally Flight (used for `routing`)

  require_once('../scripts/login.php');
  require_once('../scripts/customers.php');
  require_once('../scripts/items.php');
  require_once('../scripts/accounts.php');

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
  Flight::route('DELETE /customers/@id', 'customer_DELETE');

  // Item
  Flight::route('GET /items(/@id)', 'item_GET');
  Flight::route('POST /items', 'item_POST');
  Flight::route('PUT /items/@id', 'item_PUT');
  Flight::route('DELETE /items/@id', 'item_DELETE');

  // Account
  Flight::route('GET /accounts(/@id)', 'account_GET');
  Flight::route('POST /accounts', 'account_POST');
  Flight::route('PUT /accounts/@id', 'account_PUT');
  Flight::route('DELETE /accounts/@id', 'account_DELETE');

  // sync
  Flight::route('POST /sync', 'sync');

  Flight::start();
?>
