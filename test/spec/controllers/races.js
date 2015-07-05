'use strict';

describe('Controller: RacesCtrl', function () {

  // load the controller's module
  beforeEach(module('runstatsApp'));

  var RacesCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    RacesCtrl = $controller('RacesCtrl', {
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RacesCtrl.awesomeThings.length).toBe(3);
  });
});
