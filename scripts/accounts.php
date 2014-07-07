<?php
  function account_GET ($id) {
    user_login('', '', TRUE);
    GET(ACCOUNTS, $id);
  }

  function account_POST () {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    $request['account_user_user_id'] = $_SESSION['user_id'];
    POST(ACCOUNTS, $request);
  }

  function account_PUT ($id) {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    PUT(ACCOUNTS, $id, $request);
  }

  function account_DELETE ($id, $timesatmp) {
    user_login('', '', TRUE);
    DELETE(ACCOUNTS, $id, $timesatmp);
  }
?>
