var notify = {};

notify.message = (request, results) => {
  var response = {};
  var base = `Manual sync requested by ${request.info.remoteAddress}. Dataset: ${results.dataset}`;

  response.payload = {
    sis_upload_id: results.id,
    created_at: results.created_at
  };

  if (request.info.referrer) {
    response.message = `${base} (Referrer: ${request.info.referrer})`;
  } else {
    response.message = base;
  }

  return response;
};

module.exports = notify;
