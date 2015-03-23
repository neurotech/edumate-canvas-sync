'use strict';

var program = require('commander');
var Acho = require('acho');

var config = require('../config');
var server = require('./hapi');

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

module.exports = program;