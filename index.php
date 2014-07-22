<?php
  require_once('config.php');
  require_once('lib/medoo.php');
  require_once('lib/utils.php');
  start_session();
  generate_xsrf_token();
?>

<!DOCTYPE html>

<html lang="en">
<!-- <html lang="en" manifest="app.appcache"> -->
  <head>
    <meta charset="utf-8">
    <meta content="MnE" name="apple-mobile-web-app-title">
    <meta content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, minimal-ui" name="viewport">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">

    <!-- home screen -->
    <link rel="apple-touch-icon" sizes="57x57" href="assets/image/ico/apple-touch-icon-114.png">
    <link rel="apple-touch-icon" sizes="114x114" href="assets/image/ico/apple-touch-icon-114.png">
    <!-- bookmark -->
    <link rel="apple-touch-icon" sizes="72x72" href="assets/image/ico/apple-touch-icon-144.png">
    <link rel="apple-touch-icon" sizes="144x144" href="assets/image/ico/apple-touch-icon-144.png">

    <title>MnE</title>

    <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/pace/themes/pace-theme-minimal.css">
    <link rel="stylesheet" href="assets/ionicons/css/ionicons.min.css">
    <link rel="stylesheet" href="assets/css/style.css">
  </head>

  <body ng-app="app" ng-controller="appCtrl">
    <div class="notification-bar">
      <p id="notification-message"></p>
    </div>

    <div  class="container">
      <div id="#ngView" class="row" ng-view></div>

      <nav class="row menu hide">
        <a href="#/customers" class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
          <i class="ion-ios7-people-outline"></i>
          <small>Customers</small>
        </a>

        <a href="#/items" class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
          <i class="ion-ios7-filing-outline"></i>
          <small>Items</small>
        </a>

        <a href="#/accounts" class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
          <i class="ion-ios7-cloud-outline"></i>
          <small>Accounts</small>
        </a>

        <a href="#/more" class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
          <i class="ion-ios7-more-outline"></i>
          <small>More</small>
        </a>
      </nav>

    </div>

    <script src="assets/jquery/jquery-1.11.0.min.js"></script>
    <script src="assets/jquery/jquery.ui.effect.min.js"></script>
    <script src="assets/fastclick/fastclick.js"></script>
    <script src="assets/bootstrap/js/bootstrap.min.js"></script>
    <script src="assets/offline/offline.min.js"></script>
    <script src="assets/moment/moment.min.js"></script>
    <script src="assets/angular/angular.min.js"></script>
    <script src="assets/angular/angular-animate.min.js"></script>
    <script src="assets/angular/angular-route.min.js"></script>
    <script src="assets/angular/angular-resource.min.js"></script>
    <script src="assets/angular/angular-touch.min.js"></script>

    <script src="assets/js/dbEngine.js"></script>
    <script src="assets/js/syncEngine.js"></script>
    <script src="assets/js/app.js"></script>
    <script src="assets/js/controllers/login.js"></script>

    <script src="assets/js/controllers/customers.js"></script>
    <script src="assets/js/controllers/items.js"></script>
    <script src="assets/js/controllers/accounts.js"></script>
    <script src="assets/js/controllers/sales.js"></script>
    <script src="assets/js/controllers/deposits.js"></script>
    <script src="assets/js/controllers/more.js"></script>
    <script src="assets/js/controllers/misc/todaySale.js"></script>

    <script src="assets/js/script.js"></script>

    <!-- want pace to be initiated AFTER Safari's `roll` ends -->
    <script src="assets/pace/pace.min.js"></script>
  </body>
</html>
