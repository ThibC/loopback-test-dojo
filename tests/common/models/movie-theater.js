'use strict';

var app = require('../../../server/server');
var utils = require('../../../services/utils');
var chai = require('chai');
var expect = chai.expect;
var sinon = require ('sinon');
var sinonChai = require('sinon-chai');
var Promise = require('bluebird');
chai.use(sinonChai);

describe('MovieTheater model getAffluenceEvolutionByMonth method', function() {
  var sandbox = null;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox = sandbox.restore();
  });

  it('should return the average', function(done) {
    sandbox.stub(app.models.Affluence, 'find').callsFake(function(filters) {
      return Promise.resolve([{value: 500}, {value: 1000}, {value: 1500}]);
    });
    app.models.MovieTheater.getAverageAffluenceOverPeriod(1, '2017-06-16', '2017-06-20')
    .then(function(res) {
      expect(res).to.equal(1000);
      expect(app.models.Affluence.find).to.have.been.calledWith({where: {
        movieTheaterId: 1,
        day: {between: ['2017-06-16', '2017-06-20']},
      }});
      done();
    });
  });

  it('should return 0', function(done) {
    sandbox.stub(app.models.Affluence, 'find').callsFake(function(filters) { return Promise.resolve([]); });
    app.models.MovieTheater.getAverageAffluenceOverPeriod(0, '2017-06-16', '2017-06-20')
    .then(function(res) {
      expect(res).to.equal(0);
      expect(app.models.Affluence.find).to.have.been.calledWith({where: {
        movieTheaterId: 0,
        day: {between: ['2017-06-16', '2017-06-20']},
      }});
      done();
    });
  });
});
