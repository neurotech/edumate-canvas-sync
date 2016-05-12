'use strict';

const findKey = require('lodash.findkey');
const datasets = require('../datasets');

var datasetTools = {};

var _generate = (blob) => {
  var sets = [];

  for (var key in blob) {
    if (blob.hasOwnProperty(key)) {
      sets.push(blob[key].dataset);
    }
  }

  return sets;
};

datasetTools.validateNames = (query) => {
  var check = _generate(datasets);
  var filtered = check.filter((item) => {
    return item === query;
  });
  return filtered;
};

datasetTools.getDataset = (query) => {
  var result = findKey(datasets, { dataset: query });
  return datasets[result];
};

module.exports = datasetTools;
