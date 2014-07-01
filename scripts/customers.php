<?php
  function customer_GET ($id) {
    user_login('', '', TRUE);
    GET(CUSTOMERS, $id);
  }

  function customer_POST () {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    $request['customer_user_user_id'] = $_SESSION['user_id'];
    POST(CUSTOMERS, $request);
  }

  function customer_PUT ($id) {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    PUT(CUSTOMERS, $id, $request);
  }

  function customer_DELETE ($id) {
    user_login('', '', TRUE);
    DELETE(CUSTOMERS, $id);
  }
?>
