'use strict';

const csvHandler = require('csv');
const path = require('path');
const fs = require('fs');

const csvPath = path.join(__dirname, '../csv/');
var csv = {};

csv.make = (dataset, results) => {
  return new Promise((resolve, reject) => {
    csvHandler.stringify(results, {header: true}, (err, output) => {
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
