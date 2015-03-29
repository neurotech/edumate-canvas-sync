'use strict';

var csvHandler = require('csv');
var fs = require('fs');
var Acho = require('acho');

var config = require('../../config');
var acho = new Acho({color: true});
var csv = {};

csv.write = function(dataset, output) {
  fs.writeFileSync(config.csv.path + dataset + '.csv', output);
  acho.success('results written to ' + config.csv.path + dataset + '.csv');
};

csv.make = function(dataset, results) {
  csvHandler.stringify(results, {header: true}, function(err, output) {
    if (!err) {
      csv.write(dataset, output);
    } else {
      acho.error(err);
    }
  });
};

module.exports = csv;