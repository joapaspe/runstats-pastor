'use strict';

/**
 * @ngdoc directive
 * @name runstatsApp.directive:panel
 * @description
 * # panel
 */
angular.module('runstatsApp')
  .directive('panel', function () {
    return {
      template: '<div class="panel panel-default panel-material-blue-grey">' +
      '<div class="panel-heading">{{title}}</div>' +
      '<div class=panel-body ng-transclude></div></div>',
   /*   template: '<div class="card">' +
        '<div class="card-height-indicator"></div>' +
        '<div class="card-content">' +
       '<div class="card-header">{{title}}</div>' +
       '<div class=card-body ng-transclude></div></div></div>',*/
      restrict: 'E',
      transclude:true,
      scope: {
        title: '=title'
      }

    };
  });
