var fs = require('fs');
var request = require('request');
var schedule = require('node-schedule');
var moment = require('moment');
var config = require('./config');
var canvas = require('./lib/canvas');

//canvas.sisUpload('staff');
canvas.sisStatus();


// schedule.scheduleJob(config.uploadSchedules.test, function(){
//   console.log('Running staff upload at: ' + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
// });

// function uploadStatus() {
//   request.get({
//       url: config.canvas.uploadStatus,
//       headers: config.canvas.auth
//     },
//     function(error, response, body) {
//       var payload = JSON.parse(body);
//       var status = payload.sis_imports[0];

//       switch(status.workflow_state) {
//         case 'created':
//         case 'importing':
//           checkImport(status.id);
//           break;

//         case 'imported':
//           console.log('Latest SIS upload completed successfully on ' + moment(status.ended_at).format('dddd, MMMM Do YYYY [at] h:mm:ss a.'));
//           break;

//         case 'imported_with_messages':
//           console.log('Latest SIS upload completed with the following messages:' + '\n' + 'Processing warnings: ' + status.processing_warnings[1] + '\n' + 'Processing errors: ' + status.processing_errors[1]);
//           break;

//         case 'failed':
//           console.log('Latest SIS upload failed on ' + moment(status.ended_at).format('dddd, MMMM Do YYYY [at] h:mm:ss a.'));
//           break;

//         case 'failed_with_messages':
//           console.log('Latest SIS upload failed on ' + moment(status.ended_at).format('dddd, MMMM Do YYYY [at] h:mm:ss a.') + ' with the following message:' + '\n' + status.processing_errors[1]);
//           break;
//       }
//     }
//   );
// }

// function checkImport(id) {
//   request.get({
//       url: config.canvas.uploadStatus + id,
//       headers: config.canvas.auth
//     },
//     function(error, response, body) {
//       if (!error && response.statusCode === 200) {
//         var status = JSON.parse(body);
//         if (status.workflow_state === 'created' || status.workflow_state === 'importing') {
//           var check = setInterval(function() {
//             request.get({
//               url: config.canvas.uploadStatus + status.id,
//               headers: config.canvas.auth
//             },
//             function(error, response, body) {
//               var progress = JSON.parse(body);
//               if (progress.workflow_state === 'created' || progress.workflow_state === 'importing') {
//                 console.log('Current SIS import (' + id + ') status: ' + progress.workflow_state + ' | Progress: ' + progress.progress + '%');
//               } else {
//                 clearInterval(check);
//                 uploadStatus();
//               }
//             });
//           }, 5000);
//         } else {
//           uploadStatus();
//         }
//       } else {
//         console.log('Error: ' + error);
//       }
//     }
//   );
// }