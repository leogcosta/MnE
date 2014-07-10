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



  function syncTable ($tableName) {
    user_login('', '', TRUE);
    $request = json_decode(Flight::request() -> body, TRUE);
    $tableName = strtoupper($tableName);
    $mergeList = [];

    foreach ($request as $key => $value) {
      switch ($key) {

        // on DELETE, there's no problem here
        // even if the user wanted to delete a un-synced data
        // he/she will be allowed --- since he/she as 'full' access
        // to his/her data
        case 'DELETE':
          if (isset($GLOBALS['TABLES'][$tableName]['timestamp'])) {
            foreach ($value as $key1 => $value1) {
              $backup = $value1;

              $row = getDB() -> get($GLOBALS['TABLES'][$tableName]['tableName'],
                                    $GLOBALS['TABLES'][$tableName]['tableSelect'],
                                    [$GLOBALS['TABLES'][$tableName]['tableId'] => $value1[$GLOBALS['TABLES'][$tableName]['tableId']]]);

              $db_timestamp = date_create_from_format('Y-m-d H:i:s', $row[$GLOBALS['TABLES'][$tableName]['timestamp']]);
              $client_timestamp = date_create_from_format('Y-m-d H:i:s', $value1[$GLOBALS['TABLES'][$tableName]['timestamp']]);

              if ($db_timestamp <= $client_timestamp) {
                $result = getDB() -> delete($GLOBALS['TABLES'][$tableName]['tableName'],
                                            [$GLOBALS['TABLES'][$tableName]['tableId'] =>  $value1[$GLOBALS['TABLES'][$tableName]['tableId']]]);
              } else {
                // the operation could not be `completed`
                array_push($mergeList, $backup);
              }
            }
          } else {
            // no timestamp constraint --- proceeding with the deletion
            foreach ($value as $key1 => $value1) {
              $result = getDB() -> delete($GLOBALS['TABLES'][$tableName]['tableName'],
                                          [$GLOBALS['TABLES'][$tableName]['tableId'] =>  $value1[$GLOBALS['TABLES'][$tableName]['tableId']]]);
            }
          }
        break;



        case 'SAVE':
          // values that are not saved will be discarded
          // BUT there's a little chance of this happening
          // if the user is offline for like infinity time --- shit will be lost
          // naa, am just kidding, there will be a merge list will be returned
          // back to the sync requester
          foreach ($value as $key1 => $value1) {
            $backup = $value1;

            unset($value1['operation']);
            unset($value1[$GLOBALS['TABLES'][$tableName]['tableId']]);
            $id = getDB() -> insert($GLOBALS['TABLES'][$tableName]['tableName'], $value1);
            settype($id, 'integer');

            if ($id === 0) {
              array_push($mergeList, $backup);
            }
          }
        break;



        case 'UPDATE':
          foreach ($value as $key1 => $value1) {
            $backup = $value1;

            if (isset($GLOBALS['TABLES'][$tableName]['timestamp'])) {
              $row = getDB() -> get($GLOBALS['TABLES'][$tableName]['tableName'],
                                    $GLOBALS['TABLES'][$tableName]['tableSelect'],
                                    [$GLOBALS['TABLES'][$tableName]['tableId'] => $backup[$GLOBALS['TABLES'][$tableName]['tableId']]]);

              if ($row) {
                // row exits in the server, time to check on the timestamp son
                $db_timestamp = date_create_from_format('Y-m-d H:i:s', $row[$GLOBALS['TABLES'][$tableName]['timestamp']]);
                $client_timestamp = date_create_from_format('Y-m-d H:i:s', $value1[$GLOBALS['TABLES'][$tableName]['timestamp']]);

                if ($db_timestamp > $client_timestamp) {
                  // server has the latest version, ABANDON ship!
                  array_push($mergeList[$key], $backup);
                } else {
                  // ERYthing looks good, continue with the merge
                  unset($value1['operation']);
                  unset($value1[$GLOBALS['TABLES'][$tableName]['tableId']]);
                  $result = getDB() -> update($GLOBALS['TABLES'][$tableName]['tableName'],
                                              $value1,
                                              [$GLOBALS['TABLES'][$tableName]['tableId'] => $backup[$GLOBALS['TABLES'][$tableName]['tableId']]]);

                  if ($result === 1 || $result === 0) {
                    // update was a 'success' #BOOM!
                  } else {
                    // `conflict` detected on update
                    // pushing to mergeList
                    array_push($mergeList, $backup);
                  }
                }
              } else {
                // the update request came from an offline resource
                // merging with server db, assuming there's no collision
                unset($value1['operation']);
                unset($value1[$GLOBALS['TABLES'][$tableName]['tableId']]);
                $result = getDB() -> update($GLOBALS['TABLES'][$tableName]['tableName'],
                                            $value1,
                                            [$GLOBALS['TABLES'][$tableName]['tableId'] => $backup[$GLOBALS['TABLES'][$tableName]['tableId']]]);

                if ($result === 1 || $result === 0) {
                  // update was a 'success' #BOOM!
                } else {
                  // conflict detected on update
                  // pushing to mergeList
                  array_push($mergeList, $backup);
                }
              }
            } else {
              unset($value1['operation']);
              unset($value1[$GLOBALS['TABLES'][$tableName]['tableId']]);
              $result = getDB() -> update($GLOBALS['TABLES'][$tableName]['tableName'],
                                          $value1,
                                          [$GLOBALS['TABLES'][$tableName]['tableId'] => $backup[$GLOBALS['TABLES'][$tableName]['tableId']]]);

              if ($result === 1 || $result === 0) {
                // update was a 'success' #BOOM!
              } else {
                // conflict detected on update
                // pushing to mergeList
                array_push($mergeList, $backup);
              }
            }
          }
        break;
      }
    }



    // drum roll...
    $list = getDB() -> select($GLOBALS['TABLES'][$tableName]['tableName'],
                                $GLOBALS['TABLES'][$tableName]['tableSelect']);

    Flight::json(['LIST' => $list, 'MERGE' => $mergeList], 202);
  }
?>
