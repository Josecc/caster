// Saves options to chrome.storage
function save_options() {
  var roku_ip = document.getElementById('rokuIp').value;
  chrome.storage.sync.set({
    roku_ip: roku_ip
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
}

function test(){
  var ip = document.getElementById('rokuIp').value;
  $.ajax({
    type: "GET",
    url: "http://"+ip+":8060/query/active-app",
    timeout: 2000,
    beforeSend: function() {
      var status = document.getElementById('status');
      status.textContent = 'Testing...';
    },
    success: function() {
      var status = document.getElementById('status');
      status.textContent = 'Good! Just click save below.';
      setTimeout(function() {
        status.textContent = '';
      }, 1500);
      document.getElementById('save').removeAttribute('disabled');
    },
    error: function() {
      var status = document.getElementById('status');
      status.textContent = 'Wrong IP...';
      setTimeout(function() {
        status.textContent = '';
      }, 1500);
    }
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    roku_ip: "192.168.1.7"
  }, function(items) {
    document.getElementById('rokuIp').value = items.roku_ip;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('test').addEventListener('click',
    test);
