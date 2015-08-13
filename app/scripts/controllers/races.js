'use strict';
/**
 * @ngdoc function
 * @name runstatsApp.controller:RacesCtrl
 * @description
 * # RacesCtrl
 * Controller of the runstatsApp
 */

// Utils

function len(input) {
  if (input instanceof Object) {
    return Object.keys(input).length;
  }
  else {
    return input.length;
  }
}
var app = angular.module('runstatsApp');

app.controller('RacesCtrl', function ($scope, runstats) {

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
        'value': "teams",
        'filter': "len"
      },
      {
        'name': "Average Time Official",
        'value': "official_avg",
        'filter': "time"
      },
      {
        'name': "Best Time Official",
        'value': "official_best",
        'filter': "time"
      },
      {
        'name': "Time Real",
        'value': "real_avg",
        'filter': "time"
      },
      {
        'name': "Best Time Real",
        'value': "real_best",
        'filter': "time"
      },


    ];

    // Variables
    $scope.current_circuit = null;
    //$scope.something = "something";
    $scope.config = runstats.config;
    $scope.show_info = "None";
    $scope.show_info_race = "information";

    // Status is an object that holds some useful information
    $scope.status = {
      'data_loaded':false,
      'error': 0,
    };
    // $Loading data

    // Loading the circuits
    $scope.load_data = function () {
      runstats.getCircuits().then(function (data, status) {
       $scope.circuits = data;
       $scope.status.data_loaded = true;
       $scope.setCircuit($scope.current_circuit);
      });
    };

    function url_change(new_value, old_value) {
      console.log("URL has changed", old_value, "->", new_value, $scope.config);
      $scope.load_data();
    }
    $scope.$watch("config.server_url", url_change);

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
      $scope.selectRace(null);
      if (circuit === null) {
        runstats.getAllRaces().then(function (data) {
          $scope.races = data.races;
        });
        return;
      }

      runstats.getCircuitInfo(circuit).then(function (data) {
        $scope.circuit_info = data.circuit;
        $scope.last_query = data.circuit;
        $scope.races = $scope.circuit_info.races;
      });
      $scope.show_info = "circuit";
    };

    $scope.isRaceSelected = function (race) {
      return $scope.selected_race === race;
    };

    $scope.selectRace = function (race) {

      if (race === null) {
        $scope.show_info = 'none';
      }
      else {
        $scope.show_info = 'race';
        setInfoRaceCharts(race);
      }
      $scope.selected_race = race;


    };


    $scope.showInfoCircuit = function() {
      $scope.show_info = 'circuit';
      $scope.selected_race = 'null';
      //TODO: Show info circuit
    };

    $scope.setInfoRace = function(information) {
      $scope.show_info_race = information;

    };

    $scope.isInfoRace = function(information) {
      return $scope.show_info_race === information;
    };

    // Chart utils
  function setInfoRaceCharts(race) {

    // pie chart data_pie labels_pie
    $scope.labels_radar = [];
    $scope.data_radar = [];


    var radar_options = [
      {
        'name': "Distance",
        'value': "distance",
      },
      {
        'name': "Participants",
        'value': "runners"
      },
      {
        'name': "Teams",
        'value': "teams",
        'filter': len
      },
      {
        'name': "Average Time Official",
        'value': "official_avg",
      },
      {
        'name': "Best Time Official",
        'value': "official_best",

      },
    ];

    for(var opt in radar_options) {
      var info_option = radar_options[opt];
      $scope.labels_radar.push(info_option.name);
      var value = race[info_option.value];
      if (info_option.filter) {
        value = info_option.filter(value);
      }
      $scope.data_radar.push(value);

    }
    console.log($scope.labels_radar, $scope.data_radar);
    $scope.data_radar = [$scope.data_radar];
  }
});

app.filter('race_filter', function($filter) {
  return function (input, filter) {
    switch (filter) {
      case 'len':
        return len(input);
        break;
      case 'distance':
        var kms = parseInt(input)/1000;
        return kms + " kms";
        break;
      case 'time':
          var date = new Date(1970,0,1).setSeconds(input);
          return $filter('date')(date,"HH'h' mm'm' ss's'");
      default:
            return input;
    }
  };
});
