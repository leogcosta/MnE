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
    user_login('', '', TRUE);
    // should i go with 403: Forbidden or 410 Unauthorized
    // i choose 403 - gives it a nice bad ass look!
    logout() ? Flight::json(['message' => 'logged out, now that you are'], 202) : Flight::json(['message' => 'YOU SHALL NOT LOGOUT!'], 403);
  }
?>
