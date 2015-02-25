var request = require('request');
var prettyjson = require('prettyjson');
var config = require('./config');

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var payload = JSON.parse(body);
    console.log(prettyjson.render(payload));
  } else {
    console.log(error);
  }
};

request(config.requestOptions, callback);