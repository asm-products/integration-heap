
var Test = require('segmentio-integration-tester');
var facade = require('segmentio-facade');
var helpers = require('./helpers');
var assert = require('assert');
var should = require('should');
var Track = facade.Track;
var Heap = require('..');

describe('Heap', function () {
  var heap;
  var settings;
  var payload;
  var test;

  beforeEach(function(){
    payload = {};
    settings = { appId: '1535634150' };
    heap = new Heap(settings);
    test = Test(heap, __dirname);
  });

  it('should the correct settings', function(){
    test
      .name('Heap')
      .endpoint('https://heapanalytics.com/api')
      .ensure('settings.appId')
      .channels(['mobile', 'server']);
  });

  describe('.validate()', function () {
    it('should be invalid without appId', function () {
      test.invalid({}, {});
    });

    it('should be valid with appId', function () {
      test.valid({}, settings);
    });
  });

  describe('mapper', function(){
    describe('track', function(){
      it('should map correctly', function(){
        test.maps('track');
      });
    });

    describe('identify', function(){
      it('should map correctly', function(){
        test.maps('identify');
      });
    });
  });

  describe('.track()', function () {
    it('should return success', function (done) {
      var json = test.fixture('track');

      test
        .set(settings)
        .track(json.input)
        .sends(json.output)
        .expects(200, done);
    });

    it('should error on invalid creds', function(done){
      test
        .set({ appId: 'x' })
        .track(helpers.track())
        .error('cannot POST /api/track (400)', done);
    });
  });

  describe('.identify()', function () {
    it('should return success', function (done) {
      var json = test.fixture('identify');

      test
        .set(settings)
        .identify(json.input)
        .sends(json.output)
        .expects(200, done);
    });

    it('should error on invalid creds', function(done){
      test
        .set({ appId: 'x' })
        .track(helpers.identify())
        .error('cannot POST /api/identify (400)', done);
    });
  });
});
