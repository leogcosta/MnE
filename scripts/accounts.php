<?php
  function account_GET ($id) {
    user_login('', '', TRUE);
    GET(ACCOUNTS, $id);
  }

  function account_POST () {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    unset($request['account_id']);
    $request['account_user_user_id'] = $_SESSION['user_id'];
    if (validate_date($request['account_timestamp']) === FALSE) {
      $request['account_timestamp'] = date('Y-m-d H:i:s');
    }
    POST(ACCOUNTS, $request);
  }

  function account_PUT ($id) {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    if (validate_date($request['account_timestamp']) === FALSE) {
      $request['account_timestamp'] = date('Y-m-d H:i:s');
    }
    PUT(ACCOUNTS, $id, $request);
  }

  function account_DELETE ($id, $timesatmp) {
    user_login('', '', TRUE);
    DELETE(ACCOUNTS, $id, $timesatmp);
  }
?>
