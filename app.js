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
        var time = 'dddd, MMMM Do YYYY [at] hh:mm:ss A';
        if (!data.ended_at) {
          var ended = '-'
        } else {
          var ended = moment(data.ended_at).format(time);
        }
        var viewData = {
          id: data.id,
          created: moment(data.created_at).format(time),
          started: moment(data.started_at).format(time),
          ended: ended,
          updated: moment(data.updated_at).format(time),
          progress: data.progress,
          status: data.workflow_state,
          counts: data.data.counts,
          diff: data.diffing_data_set_identifier
        };
        reply.view('sis-status', viewData);
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

// Command line support
program
  .command('serve')
  .description('Start the hapi server.')
  .action(function(){
    server.start(function (err) {
      if (err) {
        throw err;
      }
      console.log('hapi server started');
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
