var button = document.getElementById('joinButton')

button.onclick = function() {
  $(button).popover('dispose');
  var name = document.getElementById('uName').value;
  if (/^[a-zA-Z0-9_]{4,15}$/.test(name)) {
    var conn = new WebSocket('ws://localhost:8080');
    conn.onopen = function () {
      conn.send(JSON.stringify({"id":"newUser", "name": name}));
    }
  } else {
    $(button).popover('toggle');
  }

};
