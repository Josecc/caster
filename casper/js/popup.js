$(function() {
  $('.controls').hide();
  $('#castBtn').hide();

  function playPause(ip) {
    $.post('http://'+ip+':8060/keypress/play', '');
  }
  function rev(ip) {
    $.post('http://'+ip+':8060/keypress/rev', '');
  }
  function fwd(ip) {
    $.post('http://'+ip+':8060/keypress/fwd', '');
  }

  function activate(ip, url) {
    $('#castBtn').removeAttr('disabled');
    $('#castBtn').show();
    $('output').hide();
    $('#castBtn').on('click', function() {
      $.ajax({
        type: "POST",
        url: 'http://' + ip + ':8060/launch/63126?myurl=' + url,
        timeout: 8000,
        beforeSend: function() {
          $('#castBtn').attr("disabled", "true");
        },
        success: function() {
          $('#castBtn').hide();
          $('.controls').show();
          $('#playPause').on('click', function() { playPause(ip); });
          $('#rev').on('click', function() { rev(ip); });
          $('#fwd').on('click', function() { fwd(ip); });
        },
        error: function() {
          console.log(ip + url);
          $('#castBtn').hide();
          $('output').show();
          $('output').html("No roku found at configured IP. Re-check IP.");
          chrome.tabs.create({'url': "/options.html" } );
        }
      });
    });
  }

  chrome.tabs.query({'active': true, 'currentWindow': true}, function(tabs) {
    var code = "document.getElementsByTagName('video')[0].src";
    chrome.tabs.executeScript(tabs[0].id, { code: code }, function (video) {
      if(video && video[0]){
        var url = encodeURIComponent(video[0]);
        chrome.storage.sync.get({
          roku_ip: "192.168.1.7"
        }, function(items) {
           var ip =  items.roku_ip;
           activate(ip, url);
        });
      } else {
        $('output').text("Sorry, no video found :(");
      }
    });
  });

});
