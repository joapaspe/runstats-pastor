'use strict';

/**
 * @ngdoc overview
 * @name runstatsApp
 * @description
 * # runstatsApp
 *
 * Main module of the application.
 */
angular
  .module('runstatsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'jsonFormatter'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/races', {
        templateUrl: 'views/races.html',
        controller: 'RacesCtrl',
        controllerAs: 'races'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
