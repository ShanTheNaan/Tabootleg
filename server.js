const webSocket = require('ws');
const wss = new webSocket.Server({port:7862});
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
        if (game.totalTurns == -1) game.totalTurns = game.totPlayer * 2;
        var card = game.getRandomCard();
        game.sendToAll(JSON.stringify({'id': 'startRound',
                                       'mainWord': card.cardName,
                                       'bannedWords': card.banned}));
        break;

      case 'update':
        var points = game.updateScore(obj.team, obj.point);
        var card = game.getRandomCard();
        game.sendToAll(JSON.stringify({'id': 'updateCard',
                                       'points': points,
                                       'mainWord': card.cardName,
                                       'bannedWords': card.banned}));
        break;

      case 'roundEnd':
        var points = game.resetTurn(obj.team);
        if (game.turns == game.totalTurns) {
          var winningTeam = 0;
          if (game.team1score > game.team2score) winningTeam = 1;
          if (game.team2score > game.team1score) winningTeam = 2;

          game.sendToAll(JSON.stringify({'id': 'gameEND',
                                         'team': obj.team,
                                         'points': points,
                                         'winningTeam': winningTeam}));
        } else {
          game.sendToAll(JSON.stringify({'id': 'updateScore',
                                         'team': obj.team,
                                         'points': points}));
        }

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
