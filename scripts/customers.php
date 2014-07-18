<?php
  function customer_GET ($id) {
    user_login('', '', TRUE);
    GET(CUSTOMERS, $id);
  }

  function customer_POST () {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    unset($request['customer_id']);
    $request['customer_user_user_id'] = $_SESSION['user_id'];
    if (validate_date($request['customer_timestamp']) === FALSE) {
      $request['customer_timestamp'] = date('Y-m-d H:i:s');
    }
    POST(CUSTOMERS, $request);
  }

  function customer_PUT ($id) {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    if (validate_date($request['customer_timestamp']) === FALSE) {
      $request['customer_timestamp'] = date('Y-m-d H:i:s');
    }
    PUT(CUSTOMERS, $id, $request);
  }

  function customer_DELETE ($id, $timesatmp) {
    user_login('', '', TRUE);
    DELETE(CUSTOMERS, $id, $timesatmp);
  }
?>
