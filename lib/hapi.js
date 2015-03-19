'use strict';

var hapi = require('hapi');
var config = require('../config');
var canvas = require('./canvas');

// creating the hapi server instance
var server = new hapi.Server();

server.views({
  engines: {
    html: require('handlebars')
  },
  path: './views'
});

// adding a new connection that can be listened on
server.connection({
  port: config.http.port,
  host: config.http.host,
  labels: ['web'],
  router: { stripTrailingSlash: true }
});

// defining our routes
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

// /sis-status needs tidying:

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