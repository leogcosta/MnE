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
    $request = json_decode(Flight::request() -> body, TRUE);
    Flight::json($request, 202);
    /*
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    $iCount = [
      'customers' => ['SAVE' => 0, 'UPDATE' => 0, 'DELETE' => 0],
      'items' => ['SAVE' => 0, 'UPDATE' => 0, 'DELETE' => 0],
      'accounts' => ['SAVE' => 0, 'UPDATE' => 0, 'DELETE' => 0]
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



    // ITEMS -------------------------------------------------------------------
    // save
    for ($i = 0; $i < count($request['items']['SAVE']); $i++) {
      unset($request['items']['SAVE'][$i]['item_id']);
      unset($request['items']['SAVE'][$i]['operation']);
      $id = getDB() -> insert(ITEMS, $request['items']['SAVE'][$i]);

      settype($id, 'integer');
      if ($id !== 0) {
        $iCount['items']['SAVE']++;
      }
    }

    // update
    for ($i = 0; $i < count($request['items']['UPDATE']); $i++) {
      unset($request['items']['UPDATE'][$i]['operation']);
      $row = getDB() -> get(ITEMS, ['item_id'], ['item_id' => $request['items']['UPDATE'][$i]['item_id']]);

      if ($row) {
        // updating
        $result = getDB() -> update(ITEMS, $request['items']['UPDATE'][$i], ['item_id' => $request['items']['UPDATE'][$i]['item_id']]);

        if ($result !== 1 || $result !== 0) {
          $iCount['items']['UPDATE']++;
        }
      } else {
        // creating
        unset($request['items']['UPDATE'][$i]['item_id']);
        $id = getDB() -> insert(ITEMS, $request['items']['UPDATE'][$i]);

        settype($id, 'integer');
        if ($id === 0) {
          $iCount['items']['SAVE']++;
        }
      }
    }

    // delete
    for ($i = 0; $i < count($request['items']['DELETE']); $i++) {
      $result = getDB() -> delete(ITEMS, ['customer_id' => $request['items']['DELETE'][$i]['item_id']]);
      if (!$result) {
        $iCount['items']['DELETE']++;
      }
    }

    $response['items'] = [
      'items' => getDB() -> select(ITEMS, ['item_id', 'item_item_id', 'item_name', 'item_unit_price']),
      'iCount' => $iCount['items']
    ];
    // -------------------------------------------------------------------------



    // ACCOUNTS ----------------------------------------------------------------
    // save
    for ($i = 0; $i < count($request['accounts']['SAVE']); $i++) {
      unset($request['accounts']['SAVE'][$i]['item_id']);
      unset($request['accounts']['SAVE'][$i]['operation']);
      $id = getDB() -> insert(ACCOUNTS, $request['accounts']['SAVE'][$i]);

      settype($id, 'integer');
      if ($id !== 0) {
        $iCount['accounts']['SAVE']++;
      }
    }

    // update
    for ($i = 0; $i < count($request['accounts']['UPDATE']); $i++) {
      unset($request['accounts']['UPDATE'][$i]['operation']);
      $row = getDB() -> get(ACCOUNTS, ['account_id'], ['account_id' => $request['accounts']['UPDATE'][$i]['account_id']]);

      if ($row) {
        // updating
        $result = getDB() -> update(ACCOUNTS, $request['accounts']['UPDATE'][$i], ['account_id' => $request['accounts']['UPDATE'][$i]['account_id']]);

        if ($result !== 1 || $result !== 0) {
          $iCount['accounts']['UPDATE']++;
        }
      } else {
        // creating
        unset($request['accounts']['UPDATE'][$i]['account_id']);
        $id = getDB() -> insert(ACCOUNTS, $request['accounts']['UPDATE'][$i]);

        settype($id, 'integer');
        if ($id === 0) {
          $iCount['accounts']['SAVE']++;
        }
      }
    }

    // delete
    for ($i = 0; $i < count($request['accounts']['DELETE']); $i++) {
      $result = getDB() -> delete(ACCOUNTS, ['account_id' => $request['accounts']['DELETE'][$i]['account_id']]);
      if (!$result) {
        $iCount['accounts']['DELETE']++;
      }
    }

    $response['accounts'] = [
      'accounts' => getDB() -> select(ACCOUNTS, ['account_id', 'account_name', 'account_user_user_id']),
      'iCount' => $iCount['accounts']
    ];
    // -------------------------------------------------------------------------



    Flight::json($response, 202);
    */
  }
?>
