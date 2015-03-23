var timestamp = 'dddd, MMMM Do YYYY [-] hh:mm A';

function sisStatus(){
  var sisApi = $.ajax({url: "/canvas/sis/json", dataType : "json"});
  var $sisElements = $("#job, #created, #progress");
  var $job = $("#job");
  var $created = $("#created");
  var $progress = $("#progress");

  $sisElements.text('Loading...');

  sisApi.done(function(json) {
    $job.text(json.id);
    $created.text(moment(json.created_at).format(timestamp));
    $progress.text(json.progress);
  });

  sisApi.fail(function() {
    $sisElements.text('Error querying Canvas API!');
  });
};

function canvasStatus() {
  var canvasStatusApi = $.ajax({url: "http://nlxv32btr6v7.statuspage.io/api/v2/status.json", dataType : "json"});
  var $canvasElements = $("#updated, #status, #level");
  var $updated = $("#updated");
  var $status = $("#status");
  var $level = $("#level");

  $canvasElements.text('Loading...');

  canvasStatusApi.done(function(json) {
    $updated.text(moment(json.page.updated_at).format(timestamp));
      if (json.status.indicator === 'none') {
        $status.text(json.status.description).addClass('success');
        $level.text('-').addClass(json.status.indicator);
      } else {
        $status.text(json.status.description).addClass(json.status.indicator);
        $level.text(json.status.indicator).addClass(json.status.indicator);
      }
  });

  canvasStatusApi.fail(function() {
    $canvasElements.text('Error querying Canvas status!');
  });
};

$(initPage);

function initPage(){
  $("#refresh-sis-status").on("click", sisStatus);
  $("#refresh-canvas-status").on("click", canvasStatus);
}

