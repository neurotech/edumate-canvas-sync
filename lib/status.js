'use strict';

var http = require('http');
var path = require('path');
var Datastore = require('nedb');
var config = require('../config');

var db = new Datastore({
  filename: path.join(__dirname, '../db/status.db'),
  autoload: true
});

var status = {};

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

var server = http.createServer(function (request, response) {
  db.find({}, schema).sort({id: -1}).limit(20).exec(function (err, docs) {
    if (!err) {
      response.writeHead(200, {'Content-Type': 'application/json'});
      response.end(JSON.stringify(docs));
    }
  });
});

server.listen(config.status.port, config.status.host);

status.add = function addStatus (results) {
  db.insert(results);
};

module.exports = status;
