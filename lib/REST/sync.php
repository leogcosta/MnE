<?php
  /**
    * this is a routine 99.99% CRUD - so skip!
    *
    * am going to `assume` something `dangerous` - once the sync request is sent
    * the changes request by user will be `synced` to the server (assuming
    * there isn't a conflict)
    *
    * whatever the server response is an ultimatum - my way or the highway son
    *
    * if the `procedure` is followed accordingly there shouldn't
    * be any problems - i think - which isn't my best feature
    *
    * @author Moe Szyslak <moe.duffdude@gmail.com>
    */

  function sync () {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    $iCount = [
      'customers' => ['SAVE' => 0, 'UPDATE' => 0, 'DELETE' => 0]
    ];
    $response = [];

    // CUSTOMERS ---------------------------------------------------------------
    // save
    for ($i = 0; $i < count($request['customers']['SAVE']); $i++) {
      unset($request['customers']['SAVE'][$i]['customer_id']);
      unset($request['customers']['SAVE'][$i]['operation']);
      $id = getDB() -> insert(CUSTOMERS, $request['customers']['SAVE'][$i]);

      settype($id, 'integer');
      if ($id !== 0) {
        $iCount['customers']['SAVE']++;
      }
    }

    // update
    for ($i = 0; $i < count($request['customers']['UPDATE']); $i++) {
      unset($request['customers']['UPDATE'][$i]['operation']);
      $row = getDB() -> get(CUSTOMERS, ['customer_id'], ['customer_id' => $request['customers']['UPDATE'][$i]['customer_id']]);

      if ($row) {
        // updating
        $result = getDB() -> update(CUSTOMERS, $request['customers']['UPDATE'][$i], ['customer_id' => $request['customers']['UPDATE'][$i]['customer_id']]);

        if ($result !== 1 || $result !== 0) {
          $iCount['customers']['UPDATE']++;
        }
      } else {
        // creating
        unset($request['customers']['UPDATE'][$i]['customer_id']);
        $id = getDB() -> insert(CUSTOMERS, $request['customers']['UPDATE'][$i]);

        settype($id, 'integer');
        if ($id === 0) {
          $iCount['customers']['SAVE']++;
        }
      }
    }

    // delete
    for ($i = 0; $i < count($request['customers']['DELETE']); $i++) {
      $result = getDB() -> delete(CUSTOMERS, ['customer_id' => $request['customers']['DELETE'][$i]['customer_id']]);
      if (!$result) {
        $iCount['customers']['DELETE']++;
      }
    }

    $response['customers'] = [
      'customers' => getDB() -> select(CUSTOMERS, ['customer_id', 'customer_full_name', 'customer_phone_number', 'customer_email', 'customer_user_user_id']),
      'iCount' => $iCount['customers']
    ];
    // -------------------------------------------------------------------------

    Flight::json($response, 202);
  }
?>
