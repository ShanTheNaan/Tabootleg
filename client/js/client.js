/********* HTML Elements **********/
var team1Labels = [];
var team2Labels = [];
var timeElement = document.getElementById('time');
var roundElement = document.getElementById('roundLabel');
var startButton = document.getElementById('startButton');
var currentPlayerLabel = document.getElementById('currentPlayer');
var cardDiv = document.getElementById('')

/****** Counters ******/
var totalPlayers = 0;
var round = 1;
var turn = 0;
var roundTime = 59;

var clock;
var name = Cookies.get("username");
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
        startRound();
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

startButton.onclick = function() {
  hideStartButton();
  conn.send(JSON.stringify({'id': 'startRound'}));
}


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

function startRound() {

  turn += 1;
  if (turn%2 == 0) {
    round += 1;
  }

  clock = setInterval(setTime, 1000);
  setCardDisplay();
}

/********** Helper Function ************/

function prepareStart() {
  roundElement.innerHTML = "Round " + round;
  timeElement.innerHTML = "60";

  if (turn%2 == 0) {
    if (name == team1Labels[round-1].innerHTML) {
      showStartButton();
      hideCurrentPlayer();
    } else {
      showCurrentPlayer(team1Labels);
    }
  } else {
    if (name == team2Labels[round-1].innerHTML) {
      showStartButton();
      hideCurrentPlayer();
    } else {
      showCurrentPlayer(team2Labels);
    }
  }
}

function setCardDisplay() {

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

function showCurrentPlayer(team) {
  currentPlayerLabel.innerHTML = "Current: " + team[round-1].innerHTML;
  currentPlayerLabel.style.display = 'block';
}

function hideCurrentPlayer() {
  currentPlayerLabel.style.display = 'none';
}
