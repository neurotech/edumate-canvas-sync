var program = require('commander');
var hapi = require('hapi');
var Acho = require('acho');
var schedule = require('node-schedule');
var moment = require('moment');
var config = require('./config');
var canvas = require('./lib/canvas');

var acho = new Acho({color: true});

// creating the hapi server instance
var server = new hapi.Server();

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
  path: '/sis-status',
  handler: function (request, reply) {
    canvas.sisStatus()
      .then(function(data) {
        reply(data);
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

// starting the server
server.start(function (err) {
  if (err) {
    throw err;
  }
  console.log('hapi server started');
});

// Command line support
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
  .description('Check Canvas SIS Import status.')
  .action(function(){
    canvas.sisStatus()
      .then(function(data) {
        console.log(data);
      }, function(error) {
        acho.error(error);
    });
  });

program.parse(process.argv);

// node-schedule:
// --------------
// schedule.scheduleJob(config.uploadSchedules.test, function(){
//   console.log('Running staff upload at: ' + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
// });
