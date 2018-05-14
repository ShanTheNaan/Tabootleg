const webSocket = require('ws');
const wss = new webSocket.Server({port:8080});
const Game = require('./Classes/Game.js');  

console.log("Server is Online!");

wss.on('connection', function connection(ws) {
  console.log("connected");
  ws.on('message', function incoming(message) {
    console.log("Received: " + message);
  });

});
