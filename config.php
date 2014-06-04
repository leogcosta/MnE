<?php
  /**
  * @author Moe Szyslak <moe.duffdude@gmail.com>
  */

  // time zone
  date_default_timezone_set('Africa/Addis_Ababa');

  // hash
  define('SALT', 's@1T'); // SALT to be used for the hashing (sha512)

  // cookie
  define('COOKIE_NAME', 'mne');
  define('COOKIE_AGE', 43200); // 12 Hours
  define('SECURE', FALSE);
  define('HTTP_ONLY', TRUE);

  // MySQL
  define('MYSQL_HOST', '127.0.0.1');
  define('MYSQL_USER', 'root');
  define('MYSQL_PASSWORD', 'password');
  define('MYSQL_DB_NAME', 'mne');

  // tables
  define('USERS', 'users');
?>
