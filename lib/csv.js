const csvHandler = require('csv');
const path = require('path');
const fs = require('fs');

const csvPath = path.join(__dirname, '../csv/');
var csv = {};

csv.make = (dataset, results, cb) => {
  csvHandler.stringify(results, { header: true }, (err, output) => {
    if (err) { return cb(err); }
    fs.writeFile(csvPath + dataset + '.csv', output, (err) => {
      if (err) { return cb(err); }
      let response = { path: csvPath + dataset + '.csv' };
      cb(null, response);
    });
  });
};

module.exports = csv;
