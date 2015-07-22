'use strict';

/**
 * @ngdoc function
 * @name runstatsApp.controller:ServicesInspectorCtrl
 * @description
 * # ServicesInspectorCtrl
 * Controller of the runstatsApp
 */
angular.module('runstatsApp')
  .controller('ServicesInspectorCtrl', function ($scope, $http, runstats) {

      $scope.config = runstats.config;
      console.log($scope.config)
      $scope.requested_url = "";

      $scope.testUrl = function() {

        var final_url = $scope.config.server_url+ "/"+$scope.requested_url;
        console.log(final_url);
        $http({
          method : 'GET',
          url: final_url
        }).
            success(function (data) {
              $scope.result = data;
            }).
            error(function(data, status) {
              $scope.result = data;
            });
      };

      $scope.setUrl = function (name_url) {
        $scope.requested_url = name_url;

      };

      $scope.runstats_services =
          [{
            url: "circuits",
            name: "Circuits"

          },
            {
              url: "circuit_info/divina2013",
              name: "Circuit info"
            },
            {
              url: "histogram/divina2013/429",
              name: "Histogram"
            },
            {
              url: "all_races",
              name: "Races"
            },
            {
              url: "all_circuit_races",
              name: "All Circuit Races"
            }
          ];
  });
