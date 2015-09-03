'use strict';

/**
 * @ngdoc function
 * @name runstatsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the runstatsApp
 */
angular.module('runstatsApp')
  .controller('MainCtrl', function ($scope, $http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.sample = {};
    $scope.sample.data_men = [];
    $scope.sample.data_women = [];
    $scope.sample.labels_races = [];
    $scope.sample.data_runners = [];
    $http.get('/sample_data.json').success( function(data) {
      console.log("Sample data", data);
      $scope.sample = data;
    });

  });
