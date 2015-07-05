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

    $scope.set_server = function(name) {
      $scope.config.server_url = name;
    };

    // Loading the circuits
    $scope.load_data = function() {
      runstats.getCircuits().then(function (data) {
        $scope.something = JSON.stringify(data);
        $scope.circuits = data;
      });
    };

    $scope.load_data();


    $scope.isCircuitSelected = function (circuit) {
        return $scope.current_circuit === circuit;
    };


    $scope.selectCircuit = function (circuit) {
      return $scope.current_circuit = circuit;
    };


  });


