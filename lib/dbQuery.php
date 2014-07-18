<?php
  // here `simple` AND `generic` queries are handled
  // all pre-tweaking and preparation must be done before calling `this`
  // hence `generic` and `simple`
  //
  // waw --- it's amazing how much i `evolve` - uh
  // CRUD operations are going DOWN like CRAY



  function GET ($defName, $id) {
    if (isset($id)) {
      $row = getDB() -> get($GLOBALS['TABLES'][$defName]['tableName'],
                            $GLOBALS['TABLES'][$defName]['tableSelect'],
                            [$GLOBALS['TABLES'][$defName]['tableId'] => $id]);
      $row ? Flight::json($row, 200) : Flight::json(['message' => $GLOBALS['TABLES'][$defName]['getError']], 404);
    } else {
      $result = getDB() -> select($GLOBALS['TABLES'][$defName]['tableName'],
                                  $GLOBALS['TABLES'][$defName]['tableSelect']);
      Flight::json($result, 200);
    }
  }



  function POST ($defName, $request) {
    // removing if existent
    unset($request['operation']);

    $id = getDB() -> insert($GLOBALS['TABLES'][$defName]['tableName'], $request);
    settype($id, 'integer');

    if ($id === 0) {
      Flight::json(['message' => $GLOBALS['TABLES'][$defName]['collisionError']], 409);
    } else {
      $request[$GLOBALS['TABLES'][$defName]['tableId']] = $id;
      $request['message'] = $GLOBALS['TABLES'][$defName]['newSuccess'];
      Flight::json($request, 202);
    }
  }



  function PUT ($defName, $id, $request) {
    // removing if existent
    unset($request['operation']);

    // inside the config set, if a 'timestamp' key is existent
    // we're going to do a little be more than a normal update
    if (isset($GLOBALS['TABLES'][$defName]['timestamp'])) {
      $row = getDB() -> get($GLOBALS['TABLES'][$defName]['tableName'],
                              $GLOBALS['TABLES'][$defName]['tableSelect'],
                              [$GLOBALS['TABLES'][$defName]['tableId'] => $id]);

      $db_timestamp = date_create_from_format('Y-m-d H:i:s', $row[$GLOBALS['TABLES'][$defName]['timestamp']]);
      $client_timestamp = date_create_from_format('Y-m-d H:i:s', $request[$GLOBALS['TABLES'][$defName]['timestamp']]);

      if ($db_timestamp > $client_timestamp) {
        // adding a merge key, which will be detected by the db engine
        // which will sync (i.e. overwrite) the local instance
        $row['merge'] = TRUE;
        Flight::json($row, 202);
      } else {
        // everything looks good continuing with the update...
        $request[$GLOBALS['TABLES'][$defName]['timestamp']] = date('Y-m-d H:i:s');

        $result = getDB() -> update($GLOBALS['TABLES'][$defName]['tableName'],
                                    $request,
                                    [$GLOBALS['TABLES'][$defName]['tableId'] => $id]);
        if ($result === 1 || $result === 0) {
          $request['message'] = $GLOBALS['TABLES'][$defName]['updateSuccess'];
          Flight::json($request, 202);
        } else {
          $request['message'] = $GLOBALS['TABLES'][$defName]['collisionError'];
          Flight::json($request, 406);
        }
      }
    } else {
      // proceeding with `normal` update
      $result = getDB() -> update($GLOBALS['TABLES'][$defName]['tableName'],
                                  $request,
                                  [$GLOBALS['TABLES'][$defName]['tableId'] => $id]);

      if ($result === 1 || $result === 0) {
        $request['message'] = $GLOBALS['TABLES'][$defName]['updateSuccess'];
        Flight::json($request, 202);
      } else {
        $request['message'] = $GLOBALS['TABLES'][$defName]['collisionError'];
        Flight::json($request, 406);
      }
    }
  }



  function DELETE ($defName, $id, $timestamp = null) {
    // same drill on delete too
    // if the 'two' are not in sync --- merge is returned instead of
    // the requested operation
    if (isset($GLOBALS['TABLES'][$defName]['timestamp'])) {
      $row = getDB() -> get($GLOBALS['TABLES'][$defName]['tableName'],
                              $GLOBALS['TABLES'][$defName]['tableSelect'],
                              [$GLOBALS['TABLES'][$defName]['tableId'] => $id]);

      $db_timestamp = date_create_from_format('Y-m-d H:i:s', $row[$GLOBALS['TABLES'][$defName]['timestamp']]);
      $client_timestamp = date_create_from_format('Y-m-d H:i:s', $timestamp);

      if ($db_timestamp > $client_timestamp) {
        // adding a merge key, which will be detected by the db engine
        // which will sync (i.e. overwrite) the local instance
        $row['merge'] = TRUE;
        Flight::json($row, 202);
      } else {
        // everything looks good, continuing with the update...
        $result = getDB() -> delete($GLOBALS['TABLES'][$defName]['tableName'],
                                    [$GLOBALS['TABLES'][$defName]['tableId'] => $id]);
      }
    } else {
      // proceeding with the normal deletion
      $result = getDB() -> delete($GLOBALS['TABLES'][$defName]['tableName'],
                                  [$GLOBALS['TABLES'][$defName]['tableId'] => $id]);
    }

    // this might seem blasphemy BUT it's for the greater good
    Flight::json(['message' => $GLOBALS['TABLES'][$defName]['deleteSuccess']], 200);
  }
?>
