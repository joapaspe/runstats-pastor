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

    $scope.race_options = {
      "information" : "Race Info",
      "histogram" : "Histogram"
    };

    // Info showing
    // Name value of the information
    // Todo: move this to configuration files
    $scope.info_values = [
      {
        'name': "Name",
        'value': "name"
      },
      {
        'name': "Distance",
        'value': "distance",
        'filter': "distance"
      },
      {
        'name': "Participants",
        'value': "runners"
      },
      {
        'name': "Teams",
        'value': "teams"
      },
      {
        'name': "Average Time Official",
        'value': "oficial_avg"
      },
      {
        'name': "Best Time Official",
        'value': "oficial_best"
      },
      {
        'name': "Average Official Time",
        'value': "oficial_avg"
      },
      {
        'name': "Best Time Official",
        'value': "oficial_best"
      },
      {
        'name': "Real Official Time",
        'value': "real_avg"
      },
      {
        'name': "Best Time Real",
        'value': "real_best"
      },


    ];

    // Variables
    $scope.current_circuit = null;
    //$scope.something = "something";
    $scope.something = runstats.something;
    $scope.config = runstats.config;
    $scope.show_info = "None";
    $scope.show_info_race = "information";
    $scope.set_server = function (name) {
      $scope.config.server_url = name;
    };

    // Loading the circuits
    $scope.load_data = function () {
      runstats.getCircuits().then(function (data) {
        $scope.last_query = data;
        $scope.circuits = data;
      });
    };

    $scope.load_data();


    $scope.isCircuitSelected = function (circuit) {
      return $scope.current_circuit === circuit;
    };


    /**
     * selectCircuit(circuit() load the races and the info from the races
     * @param circuit
     */
    $scope.selectCircuit = function (circuit) {
      $scope.current_circuit = circuit;
      $scope.setCircuit(circuit);
    };

    $scope.setCircuit = function (circuit) {
      runstats.getCircuitInfo(circuit).then(function (data) {
        if (circuit === null) {

        }
        $scope.circuit_info = data.circuit;
        $scope.last_query = data.circuit;
      });
    };

    $scope.isCircuitSelected = function() {
      return $scope.current_circuit !== null;
    };

    $scope.isRaceSelected = function (race) {
      return $scope.selected_race === race;
    };

    $scope.selectRace = function (race) {
      $scope.selected_race = race;
      $scope.show_info = 'race';
    };

    $scope.showInfoCircuit = function() {
      $scope.show_info = 'circuit';
      //TODO: Show info circuit
    };

    $scope.setInfoRace = function(information) {
      $scope.show_info_race = information;
    };

    $scope.isInfoRace = function(information) {
      return $scope.show_info_race === information;
    };
  })
  .filter('distance', function() {
    return function (input) {
      var kms = parseInt(input) / 1000;
      return kms + " kms";
    };
  }
);


