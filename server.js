const webSocket = require('ws');
const wss = new webSocket.Server({port:8080});
const Game = require('./Classes/Game.js');

var game = new Game();

console.log("Server is Online!");

wss.on('connection', function connection(ws) {
  console.log("connected");

  ws.on('message', function incoming(message) {
    var obj = JSON.parse(message);
    console.log("Received!" + message);

    switch(obj.id) {
      case 'newUser':
        game.addPlayer(obj.name, ws);
        break;

      case 'startRound':
        game.sendToAll(JSON.stringify({'id': 'startRound'}));
        break;

      default:
        console.log('Error: Message not recognized!');
        break;
    }

  });

  ws.on('close', function close() {
    console.log('disconnected');
    game.removePlayer(ws);
  });

});
