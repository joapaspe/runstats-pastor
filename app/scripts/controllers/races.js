'use strict';
/**
 * @ngdoc function
 * @name runstatsApp.controller:RacesCtrl
 * @description
 * # RacesCtrl
 * Controller of the runstatsApp
 */


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
      /*{
        'name': "Name",
        'value': "name"
      },*/
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
        setHistogram(race);
        setSexChart(race);
        setTeamsChart(race);
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

    var options = [
      {
        'name': "Distance",
        'key': "distance",
        'norm': 10000
      },
      {
        'name': "Participants",
        'key': "runners",
        'norm': 10000
      },
      {
        'name': "Teams",
        'key': "teams",
        'filter': filters.len,
        'norm': 500
      },
      {
        'name': "Official Time",
        'key': "official_avg",
        'norm': 40*60
      },
      {
        'name': "Average Pace",
         'func': get_avg_pace,
        'norm' : function(v) { return 1.0 - (v/300); }
      },
      {
        'name': 'Sex',
        'func': function(race) {
          var masc = race.sex[0].runners;
          return masc/race.runners;
        }
      }
    ];

    var res = get_options(race, options);
    console.log(res);

    $scope.labels_radar = res[0];
    $scope.data_radar = [res[1]];
    console.log($scope.labels_radar, $scope.data_radar[0]);
  }

  function setHistogram(race) {
    runstats.getRaceHistogram(race.id).then(function(data){
        console.log("Histogram", data);
        $scope.labels_hist = data.histogram.labels;
        $scope.data_hist = [data.histogram.values];

        console.log($scope.data_hist);
        console.log($scope.data_labels);

      });
  }

  function setSexChart(race) {

    var sex = race.sex;

    var labels = [];
    var values = [];


    for (var s in sex) {
      var csex = sex[s];
      labels.push(csex.name);
      values.push(csex.runners);
    }

  $scope.labels_sex = labels;
  $scope.data_sex = values;

  }

  function setTeamsChart(race) {
    // Show the teams most popular
    var sex = race.teams;


    var no_teams = ["INDEPENDIENTE"];
    var labels = [];
    var values = [];

    var total = race.runners;

    // Compute runners with and without teams

    var runners_in_team = 0;
    for(var team in race.teams) {


      if (no_teams.indexOf(team) > -1) {
        continue;
      }
      runners_in_team += race.teams[team];
    }

    var runners_alone = total - runners_in_team;
    labels = ["With Team", "Without Team"];
    values = [runners_in_team, runners_alone];

    $scope.labels_teams = labels;
    $scope.data_teams = values;

    /*for (var i = 0; i < teams; ++i) {

    }*/

    /* Best five teams */
    var best_labels = [];
    var best_values = [];
    var items =  Object.keys(race.teams).map(function(key) {
      return [race.teams[key], key];
    });

    /* Reverse sort */
    items.sort(function(a,b) { return b[0]-a[0]; });
    var best_five = items.splice(1,15);

    for(var b in best_five) {
      var label = short_name(best_five[b][1], 20);

      best_labels.push(label);
      best_values.push(best_five[b][0]);
    }

    $scope.labels_best_teams = best_labels;
    $scope.data_best_teams = [best_values];

  }
});

app.filter('race_filter', function($filter) {
  return function (input, filter) {
    switch (filter) {
      case 'len':
        return filters.len(input);
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
