<?php
  function item_GET ($id) {
    user_login('', '', TRUE);
    GET(ITEMS, $id);
  }

  function item_POST () {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    unset($request['item_id']);
    if (validate_date($request['item_timestamp']) === FALSE) {
      $request['item_timestamp'] = date('Y-m-d H:i:s');
    }
    POST(ITEMS, $request);
  }

  function item_PUT ($id) {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    PUT(ITEMS, $id, $request);
  }

  function item_DELETE ($id, $timesatmp) {
    user_login('', '', TRUE);
    DELETE(ITEMS, $id, $timesatmp);
  }
?>
