<?php
  function customer_GET ($id) {
    user_login('', '', TRUE);
    if (isset($id)) {
      $row = getDB() -> get(CUSTOMERS, ['customer_id', 'customer_full_name', 'customer_phone_number', 'customer_email', 'customer_user_user_id'], ['customer_id' => $id]);
      $row ? Flight::json($row, 200) : Flight::json(['message' => "customer id {$id} does not exist"], 404);
    } else {
      $result = getDB() -> select(CUSTOMERS, ['customer_id', 'customer_full_name', 'customer_phone_number', 'customer_email', 'customer_user_user_id']);
      Flight::json($result, 200);
    }
  }



  function customer_POST () {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    $request['customer_user_user_id'] = $_SESSION['user_id'];
    $id = getDB() -> insert(CUSTOMERS, $request);
    // i think it's a bug on Medoo, on failures of insertion it returns '0'
    // which is a string, to the issues page...
    settype($id, 'integer');

    // insertion went well --- NAAAAAT!
    if ($id === 0) {
      Flight::json(['message' => 'customer full name already exists'], 409);
    } else {
      $request['customer_id'] = $id;
      $request['message'] = "customer {$request['customer_full_name']} added";
      Flight::json($request, 202);
    }
  }



  function customer_PUT ($id) {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    $result = getDB() -> update(CUSTOMERS, $request, ['customer_id' => $id]);
    if ($result) {
      $request['message'] = 'customer updated';
      Flight::json($request, 202);
    } else {
      $request['message'] = 'customer update rejected';
      Flight::json($request, 406);
    }
  }



  function customer_DELETE ($id) {
    user_login('', '', TRUE);
    $result = getDB() -> delete(CUSTOMERS, ['customer_id' => $id]);
    $result ? Flight::json(['message' => 'customer deleted'], 200) : Flight::json(['message' => 'customer already deleted'], 404);
  }
?>
