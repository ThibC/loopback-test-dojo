'use strict';

var _ = require('lodash');
var utils = require('../../services/utils');

module.exports = function(MovieTheater) {
  MovieTheater.getAverageAffluenceOverPeriod = function(movieTheaterId, periodStartDate, periodEndDate, cb) {
    MovieTheater.app.models.Affluence.find({where: {
      movieTheaterId: movieTheaterId,
      day: {between: [periodStartDate, periodEndDate]},
    }},
      function(err, affluences) {
        if (err) return cb(err);
        if (_.isEmpty(affluences)) return cb(null, 0);
        affluences = utils.detach(affluences);
        var cumulatedAffluence = _.sumBy(affluences, function(affluence) { return parseInt(affluence.value); });
        var average = Math.round(cumulatedAffluence / affluences.length);
        return cb(null, average);
      });
  };

  MovieTheater.remoteMethod('getAverageAffluenceOverPeriod', {
    accepts: [
      {arg: 'movieTheaterId', type: 'number', required: true},
      {arg: 'periodStartDate', type: 'date', required: true},
      {arg: 'periodEndDate', type: 'date', required: true},
    ],
    returns: {root: true},
    http: {
      verb: 'GET',
      path: '/average-affluence-over-period',
    },
    description: 'Get average affuence over period',
  });
};
