<?php
  function customer_GET ($id) {
    user_login('', '', TRUE);
    if (isset($id)) {
      $row = getDB() -> get(CUSTOMERS, ['customer_id', 'customer_full_name', 'customer_phone_number', 'customer_email', 'customer_user_user_id'], ['customer_id' => $id]);
      $row ? Flight::json($row, 200) : Flight::json(['message' => "customer id {$id} does not exist"], 404);
    } else {
      $result = getDB() -> select(CUSTOMERS, ['customer_id', 'customer_full_name', 'customer_phone_number', 'customer_email', 'customer_user_user_id']);
      Flight::json($result);
    }
  }



  function customer_POST () {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    $request['customer_user_user_id'] = $_SESSION['user_id'];
    $id = getDB() -> insert(CUSTOMERS, $request);

    // insertion went well --- NAAAAAT!
    if ($id === '0') {
      Flight::json(['message' => 'Customer full name already exists'], 409);
    } else {
      $request['customer_id'] = $id;
      $request['message'] = "Customer {$request['customer_full_name']} added";
      Flight::json($request, 202);
    }
  }



  function customer_PUT ($id) {
  }



  function customer_DELETE ($id) {
  }
?>
