'use strict';

describe('Service: runstats', function () {

  // load the service's module
  beforeEach(module('runstatsApp'));

  // instantiate service
  var runstats;
  beforeEach(inject(function (_runstats_) {
    runstats = _runstats_;
  }));

  it('should do something', function () {
    expect(!!runstats).toBe(true);
  });

});
