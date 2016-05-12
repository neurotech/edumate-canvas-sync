'use strict';

var config = {};

/* hapi settings */
config.hapi = {
  port: 31337
};

/* Rate limiting for manual sync */
config.rate = {
  // Limit in seconds:
  limit: 60 * 5
};

/* Canvas Credentials */
config.canvas = {
  key: process.env.CANVAS_API_KEY,
  domain: process.env.CANVAS_API_DOMAIN
};

/* Edumate Credentials */
config.edumate = {
  host: process.env.EDUMATE_HOST,
  port: process.env.EDUMATE_PORT,
  suffix: process.env.EDUMATE_PATH,
  username: process.env.EDUMATE_USERNAME,
  password: process.env.EDUMATE_PASSWORD
};

/* Internal Auth Credentials */
config.auth = {
  secret: process.env.EDUMATE_CANVAS_SYNC_SECRET
};

module.exports = config;
