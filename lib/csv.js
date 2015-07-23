'use strict';

var csvHandler = require('csv');
var path = require('path');
var fs = require('fs');

var csvPath = path.join(__dirname, '../csv/');
var csv = {};

csv.make = function (dataset, results) {
  return new Promise(function (resolve, reject) {
    csvHandler.stringify(results, {header: true}, function (err, output) {
      if (err) {
        reject(err);
      } else {
        fs.writeFile(csvPath + dataset + '.csv', output, function cb () {
          if (err) {
            reject(err);
          } else {
            var response = {path: csvPath + dataset + '.csv'};
            resolve(response);
          }
        });
      }
    });
  });
};

module.exports = csv;
