'use strict';

/**
 * @ngdoc directive
 * @name runstatsApp.directive:names
 * @description
 * # names
 */
angular.module('runstatsApp')
  .directive('runstats', function () {
    return {
      template: '<span style="font-variant: small-caps"><i>Runstats</i></span>',
      restrict: 'E'
    };
  });
