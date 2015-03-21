var timestamp = 'dddd, MMMM Do YYYY [-] hh:mm A.';

$("#refresh-sis-status").on("click", function() {
  $("#job, #created, #progress").text('Loading...');
  $.ajax({
    url: "http://localhost:3000/sis-status/json",
    dataType : "json",
    success: function(json) {
      $("#job").text(json.id);
      $("#created").text(moment(json.created_at).format(timestamp));
      $("#progress").text(json.progress);
    },
    error: function() {
      $("#job, #created, #progress").text('Error querying Canvas API!');
    },
  });
});

$("#refresh-canvas-status").on("click", function() {
  $("#updated, #status, #level").text('Loading...');
  $.ajax({
    url: "http://nlxv32btr6v7.statuspage.io/api/v2/status.json",
    dataType : "json",
    success: function(json) {
      $("#updated").text(moment(json.page.updated_at).format(timestamp));
      if (json.status.indicator === 'none') {
        $("#status").text(json.status.description).addClass('success');
        $("#level").text('-').addClass(json.status.indicator);
      } else {
        $("#status").text(json.status.description).addClass(json.status.indicator);
        $("#level").text(json.status.indicator).addClass(json.status.indicator);
      }
    },
    error: function() {
      $("#updated, #status, #level").text('Error querying Canvas status!');
    },
  });
});