var name = Cookies.get("username");
console.log(name);

var conn = new WebSocket('ws://localhost:8080');
if(!document.webkitHidden) {
  conn.addEventListener('open', function (event) {
    conn.send(JSON.stringify({"id":"newUser", "name":name}));
  });
}

conn.addEventListener('message', function(event) {
  console.log('Message from server ' + event.data);
  var data = JSON.parse(event.data);
  console.log(data.split(','));

});
