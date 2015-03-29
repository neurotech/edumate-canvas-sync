'use strict';

var csvHandler = require('csv');
var fs = require('fs');

var config = require('../../config');
var csv = {};

csv.write = function(dataset, output, count) {
  return new Promise(function(resolve) {
    fs.writeFileSync(config.csv.path + dataset + '.csv', output);
    resolve(count + ' rows written to ' + config.csv.path + dataset + '.csv');
  });
};

csv.make = function(dataset, results) {
  return new Promise(function(resolve, reject) {
    var count = results.length;
    csvHandler.stringify(results, {header: true}, function(err, output) {
      if (err) {
        reject(err);
      } else {
        csv.write(dataset, output, count)
          .then(function(res) {
            resolve(res);
          });
      }
    });
  });
};

module.exports = csv;