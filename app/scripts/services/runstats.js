'use strict';

/**
 * @ngdoc service
 * @name runstatsApp.runstats
 * @description
 * # runstats
 * Service in the runstatsApp.
 */


angular.module('runstatsApp')
  .service('runstats', function ($http, $q) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    //< AngularJS will instantiate a singleton by calling "new" on this function

    var self = this;
    self.config = {};
    self.config.server_url = "http://runstatsserver.herokuapp.com/";
    self.config.pending_ops = 0;

    var deffered = $q.defer();

    $http.get('/config.json').success( function(data) {
      console.log("Setting service url", data);
      for (var op in data.config) {
        self.config[op] = data.config[op];
        console.log("Loading", op, self.config[op]);
      }

      deffered.resolve();
    }).error(function(data, status) {
      console.log("error en el self.config");
      console.log(data);
      console.log(status);

    });

    self.config.ready = deffered.promise;
    self.config.something = "The service it's working";

    // Functions
    // Retrieves a list of circuits
    this.getCircuits = function() {
      var deffered = $q.defer();
      var final_url = self.config.server_url + "/circuits";
      console.log("Getting, "+final_url);
      self.config.pending_ops += 1;
      console.log("Pending", self.config.pending_ops);
      $http({
        method : 'GET',
        url: final_url
      }).
        success(function (data) {
          deffered.resolve(data);
            self.config.pending_ops -= 1;
        }).
        error(function(data) {
          deffered.reject(data);
            self.config.pending_ops -= 1;
        });

      return deffered.promise;
    };

    // Retrieves all the races information by circuit

    this.getAllRaceCircuits = function() {
      var deffered = $q.defer();
      var final_url = self.config.server_url + "all_circuit_races";

      console.log(final_url);
      $http({
        method : 'GET',
        url: final_url
      }).
        success(function (data) {
          deffered.resolve(data);
        }).
        error(function(data) {
          deffered.reject(data);
        });

      return deffered.promise;
    };

    // Retrieves histogram for race
    this.getRaceHistogram = function(circuit, race) {
      var deffered = $q.defer();
      var final_url = self.config.server_url +
        "histogram/"+circuit+"/"+race;

      console.log(final_url);
      $http({
        method : 'GET',
        url: final_url
      }).
        success(function (data) {
          deffered.resolve(data);
        }).
        error(function(data) {
          deffered.reject(data);
        });

      return deffered.promise;
    };


    this.getCircuitInfo = function(circuit) {
      var defered = $q.defer();
      var final_url = self.config.server_url +
        "circuit_info/"+circuit;

      console.log(final_url);
      $http({
        method : 'GET',
        url: final_url
      }).
        success(function (data) {
          defered.resolve(data);
        }).
        error(function(data) {
          defered.reject(data);
        });

      return defered.promise;
    };

  });
