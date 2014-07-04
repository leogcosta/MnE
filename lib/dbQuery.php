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

    $result = getDB() -> update($GLOBALS['TABLES'][$defName]['tableName'],
                                $request, [$GLOBALS['TABLES'][$defName]['tableId'] => $id]);
    if ($result === 1 || $result === 0) {
      $request['message'] = $GLOBALS['TABLES'][$defName]['updateSuccess'];
      Flight::json($request, 202);
    } else {
      $request['message'] = $GLOBALS['TABLES'][$defName]['collisionError'];
      Flight::json($request, 406);
    }
  }



  function DELETE ($defName, $id) {
    $result = getDB() -> delete($GLOBALS['TABLES'][$defName]['tableName'],
                                [$GLOBALS['TABLES'][$defName]['tableId'] => $id]);
    $result ? Flight::json(['message' => $GLOBALS['TABLES'][$defName]['deleteSuccess']], 200) : Flight::json(['message' => $GLOBALS['TABLES'][$defName]['deleteError']], 404);
  }
?>
