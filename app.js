var Hapi = require('hapi');
var request = require('request');
var prettyjson = require('prettyjson');
var config = require('./config');

var server = new Hapi.Server();
server.connection({ port: config.http.port });

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var payload = JSON.parse(body);
    console.log(prettyjson.render(payload));
  } else {
    console.log(error);
  }
};

request(config.requestOptions, callback);

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply('There is nothing here.');
  }
});

// server.start(function () {
//   console.log('Server running at:', server.info.uri);
// });