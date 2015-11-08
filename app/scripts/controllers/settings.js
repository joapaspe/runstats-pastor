'use strict';

/**
 * @ngdoc function
 * @name runstatsApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the runstatsApp
 */
angular.module('runstatsApp')
  .controller('SettingsCtrl', function ($scope, $http, runstats) {
    $scope.version = "0.2.270";

    $scope.config = runstats.config;

    $scope.change_server = function(new_url){
      console.log("Changing Url:", new_url);
      runstats.config.server_url = new_url;
    };

  });

