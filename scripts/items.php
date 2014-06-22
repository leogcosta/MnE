<?php
  function item_GET ($id) {
    user_login('', '', TRUE);
    if (isset($id)) {
      $row = getDB() -> get(ITEMS, ['item_id', 'item_item_id', 'item_name', 'item_unit_price'], ['item_id' => $id]);
      $row ? Flight::json($row, 200) : Flight::json(['message' => "item id {$id} does not exist"], 404);
    } else {
      $result = getDB() -> select(ITEMS, ['item_id', 'item_item_id', 'item_name', 'item_unit_price']);
      Flight::json($result, 200);
    }
  }



  function item_POST () {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    $id = getDB() -> insert(ITEMS, $request);

    settype($id, 'integer');

    if ($id === 0) {
      Flight::json(['message' => 'item\'s id already exists'], 409);
    } else {
      $request['item_id'] = $id;
      $request['message'] = "item {$request['item_name']} added";
      Flight::json($request, 202);
    }
  }



  function item_PUT ($id) {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);

    $result = getDB() -> update(ITEMS, $request, ['item_id' => $id]);
    if ($result === 1 || $result === 0) {
      $request['message'] = 'item updated';
      Flight::json($request, 202);
    } else {
      $request['message'] = 'item update rejected';
      Flight::json($request, 406);
    }
  }



  function item_DELETE ($id) {
    user_login('', '', TRUE);
    $result = getDB() -> delete(ITEMS, ['item_id' => $id]);
    $result ? Flight::json(['message' => 'item deleted'], 200) : Flight::json(['message' => 'item already deleted'], 404);
  }
?>
