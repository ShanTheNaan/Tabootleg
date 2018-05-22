/********* HTML Elements **********/
var team1Labels = [];
var team2Labels = [];
var timeElement = document.getElementById('time');
var roundElement = document.getElementById('roundLabel');

/****** Counters ******/
var totalPlayers = 0;
var round = 1;
var turn = 0;
var roundTime = 59;

var clock;
var name = Cookies.get("username");


/************** WEBSOCKET ************************/
var conn = new WebSocket('ws://localhost:8080');
if(!document.webkitHidden) {
  conn.addEventListener('open', function (event) {
    conn.send(JSON.stringify({"id":"newUser", "name":name}));
  });
}

conn.onmessage = function(event) {
  var data = JSON.parse(event.data);
  console.log(data);

  if (data.id == 'newPlayer') {
    newPlayer(data.name);
  } else if (data.id == 'allPlayers') {
    allPlayers(data.data);
  }
}
/*************************************************/


for (var i=0; i < 4; i++) {
  team1Labels.push(addLabel('t1-p'+(i+1)));
  team2Labels.push(addLabel('t2-p'+(i+1)));
}

var startButton = document.getElementById('startButton');
startButton.onclick = function() {
  roundElement.innerHTML = "Round " + round;
  timeElement.innerHTML = "60";

  turn += 1;
  if (turn%2 == 0) {
    round += 1;
  }

  clock = setInterval(setTime, 1000);
  startButton.style.display = "none";
}


/************** Functions ******************/

function addLabel(id) {
  var div = document.getElementById(id);
  var playerLabel = document.createElement('P');
  div.appendChild(playerLabel);

  return playerLabel;
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
  console.log(totalPlayers);
}

function newPlayer(name) {

  if (totalPlayers%2 == 0) {
    team1Labels[Math.floor(totalPlayers/2)].innerHTML = name;
  } else {
    team2Labels[Math.floor(totalPlayers/2)].innerHTML = name;
  }

  totalPlayers += 1;
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
    startButton.style.display = "block";
    roundTime = 59;
  }
}

function checkTime(time) {
  if (time < 10) {
    return ('0' + time);
  }

  return time;
}
/*******************************************/
