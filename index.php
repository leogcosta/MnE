<?php
  require_once('config.php');
  require_once('lib/medoo.php');
  require_once('lib/utils.php');
  start_session();
  generate_xsrf_token();
?>

<!DOCTYPE html>

<!-- <html lang="en" manifest="app.appcache"> -->
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta content="MnE" name="apple-mobile-web-app-title">
    <meta content="width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, minimal-ui" name="viewport">
    <link href="assets/ico/apple-touch-icon-144-precomposed.png" sizes="144x144" rel="apple-touch-icon-precomposed">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">

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
      <div class="row" ng-view></div>

      <nav class="row menu hide">
        <a href="#/customer" class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
          <i class="ion-ios7-people-outline"></i>
          <small>Customers</small>
        </a>

        <a href="#/item" class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
          <i class="ion-ios7-filing-outline"></i>
          <small>Items</small>
        </a>

        <a href="#/account" class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
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
    <script src="assets/bootstrap/js/bootstrap.min.js"></script>
    <script src="assets/offline/offline.min.js"></script>
    <script src="assets/moment/moment.min.js"></script>
    <script src="assets/angular/angular.min.js"></script>
    <script src="assets/angular/angular-animate.min.js"></script>
    <script src="assets/angular/angular-route.min.js"></script>
    <script src="assets/angular/angular-resource.min.js"></script>
    <script src="assets/angular/angular-touch.min.js"></script>

    <script src="assets/js/dbEngine.js"></script>
    <script src="assets/js/app.js"></script>
    <script src="assets/js/controllers/login.js"></script>
    <script src="assets/js/controllers/customer.js"></script>
    <script src="assets/js/controllers/customerNew.js"></script>
    <script src="assets/js/script.js"></script>

    <!-- want pace to be initiated AFTER Safari's `roll` ends -->
    <script src="assets/pace/pace.min.js"></script>
  </body>
</html>