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


  function initialize_stats() {
    console.log("Removing lists");
    $scope.selected_races = [];
    $scope.data_men = [];
    $scope.data_women = [];
    $scope.labels_races = [];
    $scope.data_runners = [];
    $scope.data_runners_team = [];
    $scope.data_runners_without_team = [];
  }
  $scope.initialize_stats = initialize_stats;
  // Status is an object that holds some useful information
  $scope.status = {
    'data_loaded':false,
    'error': 0,
  };
  // $Loading data

  // Loading the circuits
  $scope.load_data = function () {
    initialize_stats();
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

  $scope.indexRaceSelected = function (race) {
    return $scope.selected_races.indexOf(race);
  };

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

  $scope.getColorRace = function(race) {
    var index = $scope.indexRaceSelected(race);
    if (index <= -1) {
      return null;
    }
    var color;
    if (index > Chart.defaults.global.colours.length) {
      // TODO: Color random
      color = "#F00";
    }
    else {
      color = Chart.defaults.global.colours[index];
    }
    return color;
  };

  $scope.selectedStyle = function(race) {
    var color = $scope.getColorRace(race);
    if (color === null) {
      return null;
    }
    return {
      'background-color': color,
      'color':"#eee"
    };
  };

  $scope.selectedTagStyle = function(race) {
    var color = $scope.getColorRace(race);
    if (color === null) {
      return null;
    }
    return {
      'border-bottom-color': color,
      'border-bottom-style': 'solid',
      'border-bottom-width':'2px'
    };
  };

  $scope.unselectRace =  function(index)
  {
    //Remove it
    $scope.selected_races.splice(index, 1);
    // Radar
    $scope.data_radar.splice(index, 1);

    $scope.data_men.splice(index, 1);
    $scope.data_women.splice(index, 1);
    $scope.labels_races.splice(index, 1);
    $scope.data_runners.splice(index, 1);
    //$scope.data_runners_team..splice(index, 1);
    //$scope.data_runners_without_team.splice(index, 1);

    if ($scope.selected_races.length === 0) {
      $scope.show_info = 'none';
    }
    reAdjustHistogram();
  };



  $scope.isRaceSelected = function (race) {
    return ($scope.selected_races.indexOf(race) > -1);
  };

  $scope.selectRace = function (race) {

    var index = $scope.indexRaceSelected(race);
    if(index > -1) {
      $scope.unselectRace(index);
    }
    else if (race !== null) {
      $scope.selected_races.push(race);
      $scope.show_info = 'race';
      setInfoRaceCharts(race);
      setHistogram(race);
      setSexChart(race);
      setTeamsChart(race);
      setMenWomenCharts(race);
    }
    else {
      initialize_stats();
      $scope.show_info = 'none';
    }

    var sample = {
      'data_radar': $scope.data_radar,
      'labls_radar': $scope.labels_radar,
      'data_hist': $scope.data_hist,
      'labels_hist': $scope.labels_hist,
      'data_runners' : $scope.data_runners,
      'labels_race' : $scope.labels_races,
      'data_men' : $scope.data_men,
      'data_women' : $scope.data_women

    };
    console.log(JSON.stringify(sample));
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

  $scope.show_hist_bars = true;
  $scope.toggleHist = function() {
    $scope.show_hist_bars = !$scope.show_hist_bars;
  }

  $scope.showHistBars = function() {
    return $scope.show_hist_bars;
  }
  // Chart utils
  function setInfoRaceCharts(race) {

    // pie chart data_pie labels_pie

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
        'norm': 50*60
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

    if ($scope.selected_races.length == 1) {
      $scope.labels_radar = res[0];
      $scope.data_radar = [res[1]];
    }
    else {
      $scope.data_radar.push(res[1]);
    }

    console.log($scope.labels_radar, $scope.data_radar[0]);
  }

  function setMenWomenCharts(race) {

    var men = race.sex[0].runners;
    var women = race.sex[0].runners;
    var runners = race.runners;

    $scope.data_men.push(men);
    $scope.data_women.push(women);
    $scope.data_runners.push(runners);
    $scope.labels_races.push(race.name);

    //$scope.labels_women.push(race.name);
    console.log($scope.data_men, $scope.data_women);

    console.log($scope.labels_men, $scope.labels_women);}

  function reAdjustHistogram() {
    if ($scope.selected_races.length === 1) {
      $scope.labels_hist = $scope.selected_races[0].histogram.labels;
      $scope.data_hist = [$scope.selected_races[0].histogram.values];
      return;
    }
    else{
      // Find min and max
      var max_value = 0;
      var min_value = 36000;
      var step = 120;
      for (var r in $scope.selected_races) {
        var race = $scope.selected_races[r];
        max_value = Math.max(max_value, race.histogram.time_stamps[race.histogram.time_stamps.length-1]);
        min_value = Math.min(min_value, race.histogram.time_stamps[0]);
      }
      console.log("Recomputing histogram", max_value, min_value);

      $scope.data_hist = [];
      var intervals = (max_value-min_value)/step;
      for (r in $scope.selected_races) {
        var race = $scope.selected_races[r];
        var new_hist = [];

        for (var i = 0; i < intervals; ++i)
        {
          new_hist.push(0);
        }

        // Find the first position
        var initial = 0;
        while (race.histogram.time_stamps[0] !== (min_value+initial*step)) {
          initial++;
        }
        for(var i = 0; i < race.histogram.values.length; ++i) {
          new_hist[initial+i] = race.histogram.values[i];
        }

        $scope.data_hist.push(new_hist);
      }

      //Now the labels
      $scope.labels_hist = [];
      for (var stamp = min_value; stamp <=max_value; stamp += step){
        var pos = stamp/step;
        var second = pos * step;
        var label = to_HHMMSS(second);
        $scope.labels_hist.push(label);
      }

    }
    return;
  }

  function setHistogram(race) {

    if (! race.histogram) {
      runstats.getRaceHistogram(race.id).then(function (data) {
        console.log("Histogram", data);
        race.histogram = {};
        race.histogram = data.histogram;

        reAdjustHistogram();
      });
    }
    else {
      reAdjustHistogram();
    }

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
