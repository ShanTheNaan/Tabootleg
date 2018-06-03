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
var team1scoreLabel = document.getElementById('team1score');
var team2scoreLabel = document.getElementById('team2score');
var currentScoreLabel = document.getElementById('score');
var tabooCardDiv = document.getElementById('taboo-card');
var cardBackDiv = document.getElementById('card-back');

/****** Counters ******/
var totalPlayers = 0;
var round = 1;
var turn = 0;
var roundTime = 59;

var clock;
var name = Cookies.get("username");
var conn;
var team;
var currentPlayer = "";
var currentTeam;
var totalTeam1Players = 0;
var totalTeam2Players = 0;


/************** WEBSOCKET ************************/

conn = new WebSocket('ws://69.21.138.196:7862');
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

    case 'updateCard':
      updateCard(data);
      break;

    case 'updateScore':
      updateScore(data);
      break;

    case 'gameEND':
      updateScore(data);
      var string;

      if (data.winningTeam == 0) {
        alert ("Congratulation! Both teams tie!");
      } else if (data.winningTeam == 1) {
        alert ("Congratulations to Team 1 for winning!");
      } else {
        alert ("Congratulations to Team 2 for winning!");
      }

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

  turn += 1;
  if (turn%2 == 0) {
    round += 1;
    currentTeam = 2;
  } else {
    currentTeam = 1;
  }

  setCardDisplay(mainWord, bannedWord);
  clock = setInterval(setTime, 1000);

}

function updateCard(data) {
  setCardDisplay(data.mainWord, data.bannedWords);
  setCurrentScore (data.points);
}

function updateScore(data) {
  if (data.team == 1) {
    team1scoreLabel.innerHTML = data.points;
  } else {
    team2scoreLabel.innerHTML = data.points;
  }
}

/********** Helper Function ************/

function prepareStart() {
  roundElement.innerHTML = "Round " + round;
  timeElement.innerHTML = "60";

  resetCurrentScore();

  if (turn == 0) {
    team1scoreLabel.innerHTML = 0;
    team2scoreLabel.innerHTML = 0;
  }

  setTotalTeamPlayers();
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
  if ((turn%2 == 1 && team == 2) || (turn%2 == 0 && team == 1) || name == currentPlayer) {
    hideCardBack();
    mainWordLabel.innerHTML = mainWord;
    for (var i=0; i < 5; i++) {
      bannedWordsLabel[i].innerHTML = bannedWords[i];
    }
    showDecisionButtons();
  } else {
    hideDecisionButtons();
    showCardBack();
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
    conn.send(JSON.stringify({'id': 'roundEnd', 'team': team}));
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
  showCardBack();
  hideDecisionButtons();
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
    currentPlayer = team1Labels[(round-1)%totalTeam1Players].innerHTML;
  } else {
    currentPlayer = team2Labels[(round-1)%totalTeam2Players].innerHTML;
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

  correctButton.onclick = function() {
    conn.send(JSON.stringify({'id': 'update',
                              'team': currentTeam,
                              'point': 1}));
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

  wrongButton.onclick = function() {
    conn.send(JSON.stringify({'id': 'update',
                              'team': currentTeam,
                              'point': -1}));
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

function setCurrentScore(score) {
  currentScoreLabel.innerHTML = score;
}

function resetCurrentScore() {
  currentScoreLabel.innerHTML = '0';
}

function setTeam1score (score) {
  team1scoreLabel.innerHTML = 'score';
}

function setTeam2score (score) {
  team2scoreLabel = 'score';
}

function hideDecisionButtons () {
  correctButton.style.display = 'none';
  wrongButton.style.display = 'none'
}

function showDecisionButtons () {
  correctButton.style.display = 'block';
  wrongButton.style.display = 'block';
}

function setTotalTeamPlayers() {
  totalTeam1Players = 0;
  totalTeam2Players = 0;
  for (var i=0; i < 4; i++) {
    if (team1Labels[i].innerHTML != '') totalTeam1Players +=1;
    if (team2Labels[i].innerHTML != '') totalTeam2Players +=1;
  }
}

function showCardBack() {
  cardBackDiv.style.display = 'block';
  tabooCardDiv.style.display = 'none';
}

function hideCardBack() {
  cardBackDiv.style.display = 'none';
  tabooCardDiv.style.display = 'grid';
}
