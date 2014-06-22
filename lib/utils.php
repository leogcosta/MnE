<?php  /**   * instantiates Medoo for MySQL connection   *   * @return Medoo instance   */  function getDB () {    return new medoo ([      'database_type' => 'mysql',      'database_name' => MYSQL_DB_NAME,      'server' => MYSQL_HOST,      'username' => MYSQL_USER,      'password' => MYSQL_PASSWORD    ]);  }  /**   * generates a token for Angular to read (in a delicious cookie)   * there won't be any configuration needed on Angular side since it's   * automatic, just make the cookie JavaScript readable and   * name it `XSRF-TOKEN`   *   * Angular will send `this` cookie in the header   */  function generate_xsrf_token () {    $_SESSION['UNIQUE_ID'] = generate_token(64);    $hash = hash_init('sha512');    hash_update($hash, $_SESSION['UNIQUE_ID']);    hash_update($hash, SALT);    $token = hash_final($hash);    $_SESSION['XSRF-TOKEN'] = $token;    setcookie(      'XSRF-TOKEN',      $_SESSION['XSRF-TOKEN'],      0,      '/',      SECURE,      FALSE    );  }  /**   * verifies the cookie sent, if all is good it'll allow the flow of execution   * else kills ERYthing!   *   * NOTE:   * angular will send back the cookie value   * via a header named `X-XSRF-TOKEN`   */  function verify_xsrf () {    $hash = hash_init('sha512');    hash_update($hash, $_SESSION['UNIQUE_ID']);    hash_update($hash, SALT);    $token = hash_final($hash);    if (apache_request_headers()['X-XSRF-TOKEN'] === $token) {      return TRUE;    } else {      Flight::json(['message' => 'XSRF detected, bad very'], 403);    }  }  /**   * starts session   */  function start_session () {    $cookie_params = session_get_cookie_params();    session_set_cookie_params(      COOKIE_AGE,      $cookie_params['path'],      $cookie_params['domain'],      SECURE,      HTTP_ONLY    );    session_name(COOKIE_NAME);    session_start();  }  /**   * given "credentials", it checks credentials AND (depending on flags):   * - checks session for login   * since this function is to handle `sensitive` data, if something doesn't feel   *   * @param String $username username   * @param String $password password(raw)   * @param Boolean $check_via_session weather or not to take username and password from the session or not   * @return Boolean / HTTP Response   */  function user_login ($username = '', $password = '', $check_via_session = FALSE) {    if ($check_via_session === TRUE) {      if (isset($_SESSION['user_username']) && isset($_SESSION['user_password'])) {        $username = $_SESSION['user_username'];        $password = $_SESSION['user_password'];      } else {        Flight::json(['message' => 'no found session, very bad Luke'], 412);      }    } else {      $password = hash_with_a_bit_of_salt($password);    }    $result = getDB() -> get(USERS, ['user_id', 'user_full_name', 'user_username', 'user_type'], ['AND' => ['user_username' => $username, 'user_password' => $password]]);    if (!$result) {      Flight::json(['message' => 'bad provided credentials you, bad'], 401);    } else {      if ($check_via_session === TRUE) {        return TRUE;      } else {        $_SESSION['user_id'] = $result['user_id'];        $_SESSION['user_username'] = $username;        $_SESSION['user_password'] = $password;        $_SESSION['user_full_name'] = $result['user_full_name'];        $_SESSION['user_type'] = $result['user_type'];        Flight::json($result, 202);      }    }  }  /**   * kills a session - like PAW!   *   * @return Boolean   */  function logout () {    $_SESSION = [];    $params = session_get_cookie_params();    setcookie(      COOKIE_NAME,      '',      strtotime('-1 year'),      $params['path'],      $params['domain'],      $params['secure'],      $params['httponly']    );    return session_destroy();  }  /**   * given a sting, it'll return the hash, according to the salt and shit   *   * @param String $string string to be hashed   *   * @return a hashed string   */  function hash_with_a_bit_of_salt ($sting = '') {    $hash = hash_init('sha512');    hash_update($hash, $sting);    hash_update($hash, SALT);    return hash_final($hash);  }  /**   * generates ransom string   *   * @param integer $length the length of the string to be returned   * @return String   */  function generate_token ($length) {    $seed = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';    $size = strlen($seed) - 1;    $str = '';    for ($i = 0; $i < $length; $i++) {      $str .= $seed[rand(0, $size)];    }    return $str;  }?>