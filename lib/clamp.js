'use strict';

const config = require('../config');

var clamp = {};
var lastRun;

clamp.store = (time) => {
  lastRun = time;
};

clamp.retrieve = () => {
  if (!lastRun) {
    clamp.store((Math.floor(Date.now() / 1000) - config.rate.limit));
  }
  return lastRun;
};

clamp.check = (now) => {
  if (now - clamp.retrieve() < config.rate.limit) {
    return {
      status: 'limited',
      message: `Rate limit exceeded! ${config.rate.limit - (now - clamp.retrieve())} seconds left.`
    };
  } else {
    return {
      status: 'ready',
      message: `Rate limit not exceeded. Go for it!`
    };
  }
};

module.exports = clamp;
