const hapi = require('hapi');
const relay = require('rollbar-relay');
const auth = require('./auth');
const clamp = require('./clamp');
const task = require('./task');
const notify = require('./notify');
const config = require('../config');
const datasetTools = require('./dataset-tools');

var server = new hapi.Server();

server.connection({
  port: config.hapi.port,
  router: { stripTrailingSlash: true }
});

server.register(require('hapi-auth-jwt2'), (err) => {
  if (err) { relay.error(err); }

  server.auth.strategy('jwt', 'jwt', {
    key: config.auth.secret,
    validateFunc: auth.validate,
    verifyOptions: { algorithms: [ 'HS256' ] }
  });

  server.auth.default('jwt');

  server.route([
    {
      method: 'GET',
      path: '/',
      config: { auth: false },
      handler: (request, reply) => {
        var nope = { response: 'nope' };
        reply(nope);
      }
    },
    {
      method: 'GET',
      path: '/sync/{dataset}',
      config: { auth: 'jwt' },
      handler: (request, reply) => {
        var requestedDataset = encodeURIComponent(request.params.dataset);
        if (datasetTools.validateNames(requestedDataset).length === 0) {
          var error = new Error(`Invalid dataset requested for manual sync: ${requestedDataset} by ${request.info.remoteAddress}`);
          relay.error(error);
          reply({ error: error.message }).code(400);
        } else {
          var datasetTask = datasetTools.getDataset(requestedDataset);
          var now = Math.floor(Date.now() / 1000);
          var check = clamp.check(now);
          if (check.status === 'limited') {
            reply({ error: check.message }).code(400);
          } else {
            clamp.store(now);

            task.run(datasetTask, (err, results) => {
              if (err) {
                reply(error).code(400);
                relay.error(error);
              }
              results.dataset = requestedDataset;
              var response = notify.message(request, results);
              reply({ message: response.message });
              relay.warning(response.message, response.payload);
            });
          }
        }
      }
    }
  ]);
});

module.exports = server;
