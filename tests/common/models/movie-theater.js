'use strict';

var app = require('../../../server/server');
var utils = require('../../../services/utils');
var expect = require('chai').expect;

describe('MovieTheater model getAffluenceEvolutionByMonth method', function() {
  var movieTheaterId = null;

  before(function(done) {
    app.models.MovieTheater.upsert({name: 'UGC Place de Clichy'}, function(err, movieTheater) {
      if (err) return done(err);
      movieTheater = utils.detach(movieTheater);
      movieTheaterId = movieTheater.id;
      done();
    });
  });
  before(function(done) {
    app.models.Affluence.upsert({day: '2017-06-17', movieTheaterId: movieTheaterId, value: 1000}, done);
  });
  before(function(done) {
    app.models.Affluence.upsert({day: '2017-06-18', movieTheaterId: movieTheaterId, value: 500}, done);
  });
  before(function(done) {
    app.models.Affluence.upsert({day: '2017-06-19', movieTheaterId: movieTheaterId, value: 500}, done);
  });

  after(function(done) {
    app.models.Affluence.destroyAll(function(err) {
      if (err) return done(err);
      app.models.MovieTheater.destroyAll(done);
    });
  });

  it('should return the average', function() {
    return app.models.MovieTheater.getAverageAffluenceOverPeriod(movieTheaterId, '2017-06-16', '2017-06-20')
    .then(function(res) {
      expect(res).to.equal(667);
    });
  });

  it('should return 0', function() {
    return app.models.MovieTheater.getAverageAffluenceOverPeriod(0, '2017-06-16', '2017-06-20')
    .then(function(res) {
      expect(res).to.equal(0);
    });
  });
});
