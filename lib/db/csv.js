'use strict';

var csvHandler = require('csv');
var path = require('path');
var fs = require('fs');

var csvPath = path.join(__dirname, '../../csv/');
var csv = {};

csv.write = function(dataset, output, count) {
  return new Promise(function(resolve) {
    fs.writeFileSync(csvPath + dataset + '.csv', output);
    resolve(count + ' rows written to ' + csvPath + dataset + '.csv');
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