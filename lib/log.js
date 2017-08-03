const dateFormat = require('dateformat');

module.exports = (msg) => {
  var now = dateFormat(new Date(), 'isoDateTime');
  console.log(`[${now}] ${msg}`);
};
