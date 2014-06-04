<?php
  function login_GET () {
    user_login('', '', TRUE);
    Flight::json(['message' => 'you are logged in, that you are'], 200);
  }



  /**
   * given the credentials it'll create the session for the user
   *
   * @return HTTP JSON Response {success: (true | false)}
   */
  function login_POST () {
    $request = json_decode(Flight::request() -> body, TRUE);
    user_login($request['username'], $request['password'], FALSE);
  }



  /**
   * it'll clear what ever session is remaining
   *
   * @return HTTP JSON Response {success: (true | false)}
   */
  function login_DELETE () {
  }
?>
