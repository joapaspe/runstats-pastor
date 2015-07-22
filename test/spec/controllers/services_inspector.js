'use strict';

describe('Controller: ServicesInspectorCtrl', function () {

  // load the controller's module
  beforeEach(module('runstatsApp'));

  var ServicesInspectorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ServicesInspectorCtrl = $controller('ServicesInspectorCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ServicesInspectorCtrl.awesomeThings.length).toBe(3);
  });
});
