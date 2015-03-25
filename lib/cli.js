'use strict';

var program = require('commander');
var Acho = require('acho');

var config = require('../config');
var server = require('./hapi');
var canvas = require('./canvas');

var acho = new Acho({color: true});

// Command line support
program
  .command('serve')
  .description('Start the hapi server on port ' + config.http.port)
  .action(function(){
    server.start(function (err) {
      if (err) { throw err; }
        acho.success('hapi running on: http://' + config.http.host + ':' + config.http.port);
    });
});

program
  .command('upload [csv]')
  .description('Upload CSV as new SIS Import job.')
  .action(function(csv){
    canvas.sisUpload(csv)
      .then(function(data) {
        acho.success(data.status);
      }, function(error) {
        acho.error(error);
      });
});

program
  .command('status')
  .description('Check latest Canvas SIS Import status.')
  .action(function(){
    canvas.sisStatus()
      .then(function(data) {
        console.log(data);
      }, function(error) {
        acho.error(error);
    });
});

module.exports = program;
