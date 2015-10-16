'use strict';

require('dotenv').load();

var path = require('path');
var Hapi = require('hapi');
var Datastore = require('nedb');
var canvas = require('canvas-api');
var chalk = require('chalk');

var server = new Hapi.Server();
var config = require('../config');
var db = new Datastore({
  filename: path.join(__dirname, '../db/status.db'),
  autoload: true
});

server.start(function() {
  console.log(chalk.yellow('Status Endpoint: ') + chalk.underline('http://' + process.env.EDUMATE_CANVAS_SYNC_HOST + ':' + process.env.EDUMATE_CANVAS_SYNC_PORT));
});

var status = {};

status.add = function addStatus (results) {
  db.insert(results);
};

var schema = {
  id: 1,
  created_at: 1,
  local_date: 1,
  local_time: 1,
  workflow_state: 1,
  dataset: 1,
  diffing_data_set_identifier: 1,
  _id: 0
};

server.connection({
  port: config.status.port,
  routes: {
    cors: true
  }
});

server.route({
  method: 'GET',
  path: '/status',
  handler: function (request, reply) {
    db.find({}, schema).sort({id: -1}).limit(10).exec(function (err, docs) {
      if (!err) {
        reply(JSON.stringify(docs));
      }
    });
  }
});

server.route({
  method: 'GET',
  path: '/status/{id}',
  handler: function (request, reply) {
    canvas.sisStatus({scope: request.params.id})
      .then(function (res) {
        reply(res);
      }, function (err) {
        console.error(err);
      });
  }
});

module.exports = status;
