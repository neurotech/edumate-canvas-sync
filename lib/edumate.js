'use strict';

var jdbc = require('jdbc');
var _ = require('lodash');
var fs = require('fs');
var Acho = require('acho');
var camelCase = require('camel-case');
var moment = require('moment');

var db2 = new jdbc();
var config = require('../config');
var acho = new Acho({color: true});
var edumate = {};
var cached = {};

// Create `resource`.json if it doesn't exist.
function cacheCreate(dataset) {
  var cacheFile = config.cache.path + dataset + '.json';

  return new Promise(function(resolve, reject) {
    if (!fs.existsSync(cacheFile)) {
      fs.closeSync(fs.openSync(cacheFile, 'w'));
      resolve(cacheFile + ' created!')
    } else {
      resolve(cacheFile + ' exists.');
    }
  });
}

edumate.cacheWrite = function(dataset, results) {
  cacheCreate(dataset)
    .then(function(res) {
      // Write to dataset.json
    }, function(error) {
      acho.error(error);
    });
}

// Edumate DB2 functions
// ---------------------

// Initialise DB
edumate.init = function() {
  return new Promise(function(resolve, reject) {
    db2.initialize(config.init, function(err, res) {
      if (res) {
        resolve(res);
      } else {
        reject(err);
      }
    });
  });
}

// Connect to the DB2 instance and open the database.
edumate.open = function() {
  return new Promise(function(resolve, reject) {
    db2.open(function(err, conn) {
      if (conn) {
        resolve(conn);
      } else {
        reject(err);
      }
    });
  });
}

// Close database and disconnect from the DB2 instance.
edumate.close = function() {
  return new Promise(function(resolve, reject) {
    db2.close(function(err, res) {
      if (res) {
        resolve(res);
      } else {
        reject(err);
      }
    });
  });
}

module.exports = edumate;

/* Old
function query(err, results) {
  if (err) {
    console.log(err);
  } else if (results) {
    db.canvasStaff.insert(results, function (err, newDoc) {
      console.log(newDoc);
    });
  }

  edumate.close(function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('Connection closed successfully!');
    }
  });
}

function open() {
  edumate.open(function(err, conn) {
    if (conn) {
      edumate.executeQuery('SELECT * FROM DB2INST1.view_canvas_staff_users ORDER BY login_id', query);
    }
  });
}

exports.init = function() {
  edumate.initialize(config.init, function(err) {
    if (err) {
      console.log(err);
    } else {
      open();
    }
  });
};

*/