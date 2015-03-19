'use strict';

var hapi = require('hapi');
var Acho = require('acho');
var config = require('../config');
var canvas = require('./canvas');

var server = new hapi.Server();
var acho = new Acho({color: true});

server.views({
  engines: {
    html: require('handlebars')
  },
  path: './views'
});

server.connection({
  port: config.http.port,
  host: config.http.host,
  labels: ['web'],
  router: { stripTrailingSlash: true }
});

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply('Hello world!');
  }
});

server.route({
  method: 'GET',
  path: '/sis-status/json',
  handler: function (request, reply) {
    canvas.sisStatus()
      .then(function(data) {
        reply(data);
      }, function(error) {
        reply(error);
      });
  }
});

/*
  To do:
   - Add a second, boolean parameter to sisStatus() that tells it whether to return a 'pretty' object or not.
     i.e. canvas.sisStatus(id, pretty)
          if (pretty) { return formatted object for use in a view };
*/
server.route({
  method: 'GET',
  path: '/sis-status',
  handler: function (request, reply) {
    canvas.sisStatus()
      .then(function(data) {
        reply.view('sis-status', data);
      }, function(error) {
        reply(error);
      });
  }
});

server.register({
  register: require('hapi-routes-status')
  }, function (err) {
  if (err) { acho.error('Failed to load plugin:', err); }
});

module.exports = server;