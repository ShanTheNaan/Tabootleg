var name = Cookies.get("username");
var team1Labels = [];
var team2Labels = [];
var totalPlayers = 0;

for (var i=0; i < 4; i++) {
  team1Labels.push(document.getElementById('t1-p'+(i+1)));
  team2Labels.push(document.getElementById('t2-p'+(i+1)));
}


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

function allPlayers(data) {
  var playerLabel;

  for (var i=0; i < Math.floor(data.length / 2); i++) {

    playerLabel = document.createElement('P');
    playerLabel.innerHTML = data[(i*2)];
    team1Labels[i].appendChild(playerLabel);

    playerLabel = document.createElement('P');
    playerLabel.innerHTML = data[(i*2)+1];
    team2Labels[i].appendChild(playerLabel);

    totalPlayers += 2;
  }

  if (data.length % 2 == 1) {
    playerLabel = document.createElement('P');
    playerLabel.innerHTML = data[data.length-1];
    team1Labels[Math.floor(data.length/2)].appendChild(playerLabel);

    totalPlayers += 1;
  }
}

function newPlayer(name) {
  var playerLabel = document.createElement('P');
  playerLabel.innerHTML = name;

  if (totalPlayers%2 == 0) {
    team1Labels[Math.floor(totalPlayers/2)].appendChild(playerLabel);
  } else {
    team2Labels[Math.floor(totalPlayers/2)].appendChild(playerLabel);
  }

  totalPlayers += 1;
}
