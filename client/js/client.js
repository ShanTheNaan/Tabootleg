/********* HTML Elements **********/
var team1Labels = [];
var team2Labels = [];
var bannedWordsLabel = [];
var mainWordLabel = document.getElementById('mainWord');
var timeElement = document.getElementById('time');
var roundElement = document.getElementById('roundLabel');
var startButton = document.getElementById('startButton');
var currentPlayerLabel = document.getElementById('currentPlayer');
var correctButton = document.getElementById('correctButton');
var wrongButton = document.getElementById('wrongButton');

/****** Counters ******/
var totalPlayers = 0;
var round = 1;
var turn = 0;
var roundTime = 59;

var clock;
var name = Cookies.get("username");
var currentPlayer = "";
var team;
var conn;

/************** WEBSOCKET ************************/

conn = new WebSocket('ws://localhost:8080');
if(!document.webkitHidden) {
  conn.addEventListener('open', function (event) {
    conn.send(JSON.stringify({"id":"newUser", "name":name}));
  });
}

conn.onmessage = function(event) {
  var data = JSON.parse(event.data);
  console.log(data);

  switch (data.id) {
    case 'newPlayer':
      newPlayer(data.name);
      break;

    case 'allPlayers':
      allPlayers(data.data);
      break;

    case 'startRound':
        startRound(data);
        break;

    default:
      console.log("Error: Incorrect Server Message");
  }
}

/********************************************/

for (var i=0; i < 4; i++) {
  team1Labels.push(addLabel('t1-p'+(i+1)));
  team2Labels.push(addLabel('t2-p'+(i+1)));
}

for (var i=0; i < 5; i++) {
  bannedWordsLabel.push(addLabel("ban"+(i+1)));
}

startButton.onclick = function() {
  hideStartButton();
  conn.send(JSON.stringify({'id': 'startRound'}));
}

setCorrectButtonEvents();
setWrongButtonEvents();
setStartButtonEvents();

/************** Functions ******************/

function newPlayer(name) {

  if (totalPlayers%2 == 0) {
    team1Labels[Math.floor(totalPlayers/2)].innerHTML = name;
  } else {
    team2Labels[Math.floor(totalPlayers/2)].innerHTML = name;
  }

  totalPlayers += 1;
  if (totalPlayers == 4) prepareStart();
}

function allPlayers(data) {
  clearLabels();

  for (var i=0; i < Math.floor(data.length / 2); i++) {
    team1Labels[i].innerHTML = data[(i*2)];
    team2Labels[i].innerHTML = data[(i*2)+1];
  }

  if (data.length % 2 == 1) {
    team1Labels[Math.floor(data.length/2)].innerHTML = data[data.length-1];
  }

  totalPlayers = data.length;
  (totalPlayers >= 4) ? prepareStart() : (hideStartButton(), hideCurrentPlayer());
}

function startRound(data) {
  var mainWord = data.mainWord;
  var bannedWord = data.bannedWords;

  setCardDisplay(mainWord, bannedWord);
  clock = setInterval(setTime, 1000);

  turn += 1;
  if (turn%2 == 0) {
    round += 1;
  }

}

/********** Helper Function ************/

function prepareStart() {
  roundElement.innerHTML = "Round " + round;
  timeElement.innerHTML = "60";

  setCurrentPlayer();
  if (name == currentPlayer) {
    showStartButton();
    hideCurrentPlayer();
  } else {
    showCurrentPlayer();
  }

  for (var i=0; i < 4; i++) {
    if (name == team1Labels[i].innerHTML) {
      team = 1;
      break;
    }
    if (name == team2Labels[i].innerHTML) {
      team = 2;
      break;
    }
  }
}

function setCardDisplay(mainWord, bannedWords) {
  if ((turn%2 == 0 && team == 2) || (turn%2 == 1 && team == 1) || name == currentPlayer) {
    mainWordLabel.innerHTML = mainWord;
    for (var i=0; i < 5; i++) {
      bannedWordsLabel[i].innerHTML = bannedWords[i];
    }
  }
}

function addLabel(id) {
  var div = document.getElementById(id);
  var playerLabel = document.createElement('P');
  div.appendChild(playerLabel);

  return playerLabel;
}

function clearLabels() {
  for (var i=0; i < 4; i++) {
    team1Labels[i].innerHTML = "";
    team2Labels[i].innerHTML = "";
  }
}

function setTime() {
  timeElement.innerHTML = checkTime(roundTime);
  roundTime -= 1;
  if (roundTime == -1) {
    clearInterval(clock);
    resetRound();
  }
}

function checkTime(time) {
  if (time < 10) {
    return ('0' + time);
  }

  return time;
}

function resetRound() {
  roundTime = 59;
  prepareStart();
}

function showStartButton() {
  startButton.style.display = 'block';
}

function hideStartButton() {
  startButton.style.display = 'none';
}

function showCurrentPlayer() {
  currentPlayerLabel.innerHTML = currentPlayer;
  currentPlayerLabel.style.display = 'block';
}

function hideCurrentPlayer() {
  currentPlayerLabel.style.display = 'none';
}

function setCurrentPlayer() {
  if (turn%2 == 0) {
    currentPlayer = team1Labels[round-1].innerHTML;
  } else {
    currentPlayer = team2Labels[round-1].innerHTML;
  }
}

function setCorrectButtonEvents() {
  correctButton.onmousemove = function() {
    correctButton.style.backgroundColor = 'mediumseagreen';
  }

  correctButton.onmouseout = function() {
    correctButton.style.backgroundColor = 'limegreen';
  }

  correctButton.onmousedown = function() {
    correctButton.style.background = 'seagreen';
  }

  correctButton.onmouseup = function() {
    correctButton.style.background = 'mediumseagreen';
  }
}

function setWrongButtonEvents() {

  wrongButton.onmousemove = function() {
    wrongButton.style.backgroundColor = 'orangered';
  }

  wrongButton.onmouseout = function() {
    wrongButton.style.backgroundColor = 'tomato';
  }

  wrongButton.onmousedown = function() {
    wrongButton.style.backgroundColor = 'firebrick';
  }

  wrongButton.onmouseup = function() {
    wrongButton.style.backgroundColor = 'orangered';
  }
}

function setStartButtonEvents() {
  startButton.onmousemove = function() {
    startButton.style.backgroundColor = '#039BE5';
  }

  startButton.onmouseout = function () {
    startButton.style.backgroundColor = '#29B6F6';
  }

  startButton.onmousedown = function() {
    startButton.style.backgroundColor = '#0277BD';
  }

  startButton.onmouseup = function() {
    startButton.style.backgroundColor = '#039BE5';
  }
}
