'use strict';

var jdbc = require('jdbc');
var Acho = require('acho');
var config = require('../../config');
var csv = require('./csv');

var acho = new Acho({color: true});
var db2 = new jdbc();

var edumate = {};

// Edumate DB2 functions
// ---------------------

// Initialise DB
edumate.init = function() {
  return new Promise(function(resolve, reject) {
    db2.initialize(config.init, function(err, res) {
      if (res) {
        resolve('connected to ' + config.edumate.host + ':' + config.edumate.port + ' as ' + config.edumate.username);
      } else {
        reject(err);
      }
    });
  });
};

// Connect to the DB2 instance and open the database.
edumate.open = function() {
  return new Promise(function(resolve, reject) {
    db2.open(function(err, conn) {
      if (conn) {
        resolve('opened db2 database');
      } else {
        reject(err);
      }
    });
  });
};

edumate.queryHandler = function(dataset, sql) {
  return new Promise(function(resolve, reject) {
    acho.info('executing ' + dataset + ' query:');
    acho.info('`' + sql + '`');
    db2.executeQuery(sql, function(err, results) {
      if (err) {
        reject(err);
      } else {
        csv.make(dataset, results)
          .then(function(res) {
            resolve(res);
          }, function(err) {
            reject(err);
          });
      }
    });
  });
};

// Query the database
edumate.query = function(dataset, sql) {
  return new Promise(function(resolve, reject) {
    acho.warning('\'' + dataset + '\'' + ' query initiated.');
    // init db
    edumate.init()
      .then(function(res) {
        acho.success(res);
        // open db
        edumate.open()
          .then(function(conn) {
            acho.success(conn);
            // query db
            edumate.queryHandler(dataset, sql)
              .then(function(complete) {
                acho.success(complete);
                edumate.close()
                  .then(function(res) {
                    acho.info(res);
                    resolve(complete);
                  }, function(err) {
                    reject(err);
                  });
              }, function(err) {
                acho.error(err);
              });
          }, function(err) {
            acho.error(err);
          });
      }, function(err) {
        acho.error(err);
      });
  });
};

// Close database and disconnect from the DB2 instance.
edumate.close = function() {
  return new Promise(function(resolve, reject) {
    db2.close(function(err) {
      if (!err) {
        resolve('closed db2 database and disconnected OK');
      } else {
        reject(err);
      }
    });
  });
};

module.exports = edumate;