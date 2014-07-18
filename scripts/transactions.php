<?php
  function transaction_GET ($id) {
    user_login('', '', TRUE);
    GET(TRANSACTIONS, $id);
  }

  function transaction_POST () {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    unset($request['transaction_id']);
    $request['transaction_user_user_id'] = $_SESSION['user_id'];
    if (validate_date($request['transaction_timestamp']) === FALSE) {
      $request['transaction_timestamp'] = date('Y-m-d H:i:s');
    }
    POST(TRANSACTIONS, $request);
  }

  function transaction_PUT ($id) {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    if (validate_date($request['transaction_timestamp']) === FALSE) {
      $request['transaction_timestamp'] = date('Y-m-d H:i:s');
    }
    PUT(TRANSACTIONS, $id, $request);
  }

  function transaction_DELETE ($id, $timesatmp) {
    user_login('', '', TRUE);
    DELETE(TRANSACTIONS, $id, $timesatmp);
  }
?>
