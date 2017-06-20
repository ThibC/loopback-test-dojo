'use strict';

var _ = require('lodash');
var utils = require('../../services/utils');

module.exports = function(MovieTheater) {
  MovieTheater.getAverageAffluenceOverPeriod = function(movieTheaterId, periodStartDate, periodEndDate) {
    return MovieTheater.app.models.Affluence.find({where: {
      movieTheaterId: movieTheaterId,
      day: {between: [periodStartDate, periodEndDate]},
    }})
    .then(function(affluences) {
      if (_.isEmpty(affluences)) return 0;
      affluences = utils.detach(affluences);
      var cumulatedAffluence = _.sumBy(affluences, function(affluence) { return parseInt(affluence.value); });
      var average = Math.round(cumulatedAffluence / affluences.length);
      return average;
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
