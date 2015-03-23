'use strict';

var jdbc = require('jdbc');

var db2 = new jdbc();
var config = require('../config');

function query(err, results) {
  if (err) {
    console.log(err);
  } else if (results) {
    console.log(results);
  }

  db2.close(function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('Connection closed successfully!');
    }
  });
}

function open() {
  db2.open(function(err, conn) {
    if (conn) {
      db2.executeQuery('SELECT * FROM DB2INST1.view_all_reports', query);
    }
  });
}

exports.init = function() {
  db2.initialize(config.init, function(err) {
    if (err) {
      console.log(err);
    } else {
      open();
    }
  });
};
