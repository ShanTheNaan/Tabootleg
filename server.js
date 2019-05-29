/***  Consts ***/
const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Game = require('./Classes/Game.js');


var rooms = {}

setStaticDirs();
setupRoutes();

server.listen(3000, function(){
  console.log('listening on *:3000');
});

function setStaticDirs() {
  app.use(express.static('client/css'));
  app.use(express.static('client/fonts'));
  app.use(express.static('client/images'));
  app.use(express.static('client/js'));
}

function setupRoutes() {
  setupGetRoutes();
  setupPostRoutes();
}

/************* Setup POST routes *****************/
function setupPostRoutes() {
  
  /*** New Room ***/
  app.post ('/newRoom', function (req, res) {
    let rc = createRoomCode()
    while (rc in rooms) {
      rc = createRoomCode()
      console.log(rc)
    }
    
    console.log("new room")
    rooms[rc] = new Game()
    res.send(rc)
  });
}


/************* Setup GET routes *****************/
function setupGetRoutes() { 
 
  /*** GET root ***/
  app.get('/', function (req, res) {
    console.log ("here")
    res.sendFile (__dirname + '/client/index.html');
  });

  /*** Game UI ***/
  app.get(/.{4}/, function (req, res) {
    console.log ("sado")
    res.sendFile (__dirname + '/client/GameUI.html')
  });
}

/************* Helper Functions *************/

function createRoomCode() {
  let chars = "ABCDEFGHJKLMNOPQRSTUVWXYZ01234567890"
  let str = ""

  for (let i=0; i < 4; i++) {
    str += chars.charAt(Math.floor (Math.random() * chars.length))
  }
  return str
}










// wss.on('connection', function connection(ws) {
//   console.log("connected");

//   ws.on('message', function incoming(message) {
//     var obj = JSON.parse(message);
//     console.log("Received!" + message);

//     switch(obj.id) {
//       case 'newUser':
//         game.addPlayer(obj.name, ws);
//         break;

//       case 'startRound':
//         var card = game.getRandomCard();
//         game.sendToAll(JSON.stringify({'id': 'startRound',
//                                        'mainWord': card.cardName,
//                                        'bannedWords': card.banned}));
//         break;

//       default:
//         console.log('Error: Message not recognized!');
//         break;
//     }

//   });

//   ws.on('close', function close() {
//     console.log('disconnected');
//     game.removePlayer(ws);
//   });

// });
