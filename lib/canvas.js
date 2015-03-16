// Canvas API Wrapper
// To do: refactor away from axios back to request. Make use of previous commit maybe?

var fs = require('fs');
var axios = require('axios');
var Acho = require('acho');
var moment = require('moment');
var config = require('../config');

var acho = new Acho({color: true});

exports.sisStatus = function(id) {
  id = id || '';
  axios.get(config.canvas.sisGet + id, {headers: config.canvas.auth})
    .then(function(response) {
      if (!id || '') {
        console.log(response.data.sis_imports[0]);
      } else {
        console.log(response.data);
      }
    })
    .catch(function(response) {
      if (response instanceof Error) {
        acho.error(response.message);
      }
    });
};

exports.sisUpload = function(csv) {
  console.log(__dirname + '/../csv/' + csv + '.csv');
  axios.post(config.canvas.sisPost,
    {formData: { attachment: fs.createReadStream(__dirname + '/../csv/' + csv + '.csv') }},
    {headers: config.canvas.auth})
    .then(function(response) {
      console.log(response);
    })
    .catch(function(response) {
      console.log(response);
    });
};

// exports.sisStatus = function(data) {
//   switch(data.workflow_state) {
//     case 'created':
//     case 'importing':
//       acho.info('Latest SIS upload is in progress. It was created on ' + moment(data.created_at).format('dddd, MMMM Do YYYY [at] h:mm:ss a') + ' and is currently ' + data.progress + '% complete.')
//       break;

//     case 'imported':
//       acho.success('Latest SIS upload completed successfully on ' + moment(data.ended_at).format('dddd, MMMM Do YYYY [at] h:mm:ss a.'));
//       break;

//     case 'imported_with_messages':
//       acho.warning('Latest SIS upload completed with the following messages:' + '\n' + 'Processing warnings: ' + data.processing_warnings[1] + '\n' + 'Processing errors: ' + data.processing_errors[1]);
//       break;

//     case 'failed':
//       acho.error('Latest SIS upload failed on ' + moment(data.ended_at).format('dddd, MMMM Do YYYY [at] h:mm:ss a.'));
//       break;

//     case 'failed_with_messages':
//       acho.error('Latest SIS upload failed on ' + moment(data.ended_at).format('dddd, MMMM Do YYYY [at] h:mm:ss a.') + ' with the following message:' + '\n' + data.processing_errors[1]);
//       break;
//   }
// };