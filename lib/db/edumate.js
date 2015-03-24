'use strict';

var jdbc = require('jdbc');
var Acho = require('acho');
var config = require('../../config');
var cache = require('./cache');

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

// Query the database
edumate.query = function(dataset, sql) {
  return new Promise(function(resolve, reject) {
    // init db
    edumate.init()
      .then(function(res) {
        acho.success(res);
        // open db
        edumate.open()
          .then(function(conn) {
            acho.success(conn);
            // query db
            acho.info('executing ' + dataset + ' query:')
            acho.info('`' + sql + '`');
            db2.executeQuery(sql, function(err, results) {
              cache.write(dataset, results);
              // close db
              edumate.close()
                .then(function(res) {
                  acho.success(res);
                  resolve(dataset + ' query complete!');
                }, function(err) {
                  acho.error(err);
                });
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