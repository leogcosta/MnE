<?php
  require_once('../config.php'); // configuration variables
  require_once('../lib/medoo.php'); // utilities function
  require_once('../lib/utils.php'); // utilities function
  require_once('flight/Flight.php'); // and finally Flight (used for `routing`)

  require_once('../lib/REST/login.php');
  require_once('../lib/REST/customer.php');
  start_session();
  verify_xsrf();

  // Error, and it's a big one
  // and lets be honest, & am repeating myself here, which i usually don't do ;)
  // has there been a better use for Justin Bieber than *THIS*
  Flight::map('error', function (Exception $ex) {
    Flight::json(['message' => $ex -> getMessage()], 500);
  });

  // Login
  Flight::route('POST /login', 'login_POST');
  Flight::route('DELETE /login', 'login_DELETE');

  // Customers
  Flight::route('GET /customers(/@id)', 'customer_GET');
  Flight::route('POST /customers', 'customer_POST');
  Flight::route('PUT /customers/@id', 'customer_PUT');
  Flight::route('DELETE /customers/@id', 'customer_DELETE');

  Flight::start();
?>
