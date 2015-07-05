'use strict';

/**
 * @ngdoc function
 * @name runstatsApp.controller:RacesCtrl
 * @description
 * # RacesCtrl
 * Controller of the runstatsApp
 */
angular.module('runstatsApp')
  .controller('RacesCtrl', function ($scope, runstats) {
    this.awesomeThings = [
      'Races',
      'Circuits',
      'histograms'
    ];


    // Variables
    $scope.current_circuit = null;
    $scope.something = "something";
    $scope.something = runstats.something;
    $scope.config = runstats.config;

    $scope.setServer = function(name) {
      $scope.config.server_url = name;
    };
  });


