var path = require('path');
var canvas = require('./canvas');

module.exports = [
  // Generic
  {
    method: 'GET',
    path: '/',
    handler: function (request, reply) { reply('Hello world!'); },
    config: {
      description: 'Hello world!',
      notes: 'Currently does nothing.',
      tags: ['index', 'greeting']
    }
  },
  // Canvas
  {
    method: 'GET',
    path: '/canvas/sis/json',
    handler: function (request, reply) {
      canvas.sisStatus()
        .then(function(data) {
          reply(data);
        }, function(error) {
          reply(error);
        });
    },
    config: {
      description: 'Returns a JSON object containing information on the latest SIS Import in Canvas.',
      notes: 'This route currently only shows the latest object.',
      tags: ['canvas', 'sis', 'json']
    }
  },
  // Static Files
  {
    method: 'GET',
    path: '/js/{param*}',
    handler: {directory: {path: path.join(__dirname, '/public/js/')}},
    config: {
      description: 'Route for serving static JavaScript files.',
      tags: ['static', 'js']
    }
  },
  {
    method: 'GET',
    path: '/css/{param*}',
    handler: {directory: {path: path.join(__dirname, '/public/css/')}},
    config: {
      description: 'Route for serving static CSS files.',
      tags: ['static', 'css']
    }
  }
];
