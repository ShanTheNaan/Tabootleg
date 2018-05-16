var name = Cookies.get("username");
console.log(name);

var conn = new WebSocket('ws://localhost:8080');
conn.onopen = function () {
  conn.send(JSON.stringify({"id":"newUser", "name":name}));
}

conn.addEventListener('message', function(event) {
  console.log('Message from server ' + event.data);
});
