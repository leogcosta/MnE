<?php
  function sale_GET ($id) {
    user_login('', '', TRUE);
    GET(SALES, $id);
  }

  function sale_POST () {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    unset($request['sale_id']);
    $request['sale_user_user_id'] = $_SESSION['user_id'];
    if (validate_date($request['sale_timestamp']) === FALSE) {
      $request['sale_timestamp'] = date('Y-m-d H:i:s');
    }
    POST(SALES, $request);
  }

  function sale_PUT ($id) {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    PUT(SALES, $id, $request);
  }

  function sale_DELETE ($id, $timesatmp) {
    user_login('', '', TRUE);
    DELETE(SALES, $id, $timesatmp);
  }
?>
