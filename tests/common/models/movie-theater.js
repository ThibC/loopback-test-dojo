'use strict';

var movieTheater = require('../../../common/models/movie-theater');
var chai = require('chai');
var expect = chai.expect;
var sinon = require ('sinon');
var sinonChai = require('sinon-chai');
var Promise = require('bluebird');
chai.use(sinonChai);

describe('MovieTheater model getAffluenceEvolutionByMonth method', function() {
  var sandbox = null;
  var MovieTheater = null;

  before(function() {
    MovieTheater = {
      app: {models: {Affluence: {}}},
      remoteMethod: function() {},
    };
  });

  it('should return the average', function(done) {
    MovieTheater.app.models.Affluence.find = sinon.stub().callsFake(function(filters) {
      return Promise.resolve([{value: 500}, {value: 1000}, {value: 1500}]);
    });
    movieTheater(MovieTheater);
    MovieTheater.getAverageAffluenceOverPeriod(1, '2017-06-16', '2017-06-20')
    .then(function(res) {
      expect(res).to.equal(1000);
      expect(MovieTheater.app.models.Affluence.find).to.have.been.calledWith({where: {
        movieTheaterId: 1,
        day: {between: ['2017-06-16', '2017-06-20']},
      }});
      done();
    });
  });

  it('should return 0', function(done) {
    MovieTheater.app.models.Affluence.find = sinon.stub().callsFake(function(filters) {
      return Promise.resolve([]);
    });
    movieTheater(MovieTheater);
    MovieTheater.getAverageAffluenceOverPeriod(0, '2017-06-16', '2017-06-20')
    .then(function(res) {
      expect(res).to.equal(0);
      expect(MovieTheater.app.models.Affluence.find).to.have.been.calledWith({where: {
        movieTheaterId: 0,
        day: {between: ['2017-06-16', '2017-06-20']},
      }});
      done();
    });
  });

  it('should return an error', function(done) {
    MovieTheater.app.models.Affluence.find = sinon.stub().callsFake(function(filters) {
      return Promise.reject('oupsss!');
    });
    MovieTheater.getAverageAffluenceOverPeriod('yo!', '2017-06-16', '2017-06-20')
    .then(function() { done('should not been called'); })
    .catch(function(err) {
      expect(err).to.eql('oupsss!');
      done();
    });
    ;
  });
});
