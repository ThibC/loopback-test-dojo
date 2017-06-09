'use strict';

module.exports.detach = function(input) {
  return JSON.parse(JSON.stringify(input));
};
