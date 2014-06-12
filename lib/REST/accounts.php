<?php
  function account_GET ($id) {
    user_login('', '', TRUE);
    if (isset($id)) {
      $row = getDB() -> get(ACCOUNTS, ['account_id', 'account_name', 'account_user_user_id'], ['account_id' => $id]);
      $row ? Flight::json($row, 200) : Flight::json(['message' => "account id {$id} does not exist"], 404);
    } else {
      $result = getDB() -> select(ACCOUNTS, ['account_id', 'account_name', 'account_user_user_id']);
      Flight::json($result, 200);
    }
  }



  function account_POST () {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    $request['account_user_user_id'] = $_SESSION['user_id'];
    $id = getDB() -> insert(ACCOUNTS, $request);
    settype($id, 'integer');

    if ($id === 0) {
      Flight::json(['message' => 'account name already exists'], 409);
    } else {
      $request['account_id'] = $id;
      $request['message'] = "account {$request['account_name']} added";
      Flight::json($request, 202);
    }
  }



  function account_PUT ($id) {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);

    $result = getDB() -> update(ACCOUNTS, $request, ['account_id' => $id]);
    if ($result === 1 || $result === 0) {
      $request['message'] = 'account updated';
      Flight::json($request, 202);
    } else {
      $request['message'] = 'account update rejected';
      Flight::json($request, 406);
    }
  }



  function account_DELETE ($id) {
    user_login('', '', TRUE);
    $result = getDB() -> delete(ACCOUNTS, ['account_id' => $id]);
    $result ? Flight::json(['message' => 'account deleted'], 200) : Flight::json(['message' => 'account already deleted'], 404);
  }
?>
