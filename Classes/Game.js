class Player {
  constructor (name, conn) {
    this.conn = conn;
    this.name = name;
  }
}

class Game {

  constructor () {
    this.team1 = [];
    this.team2 = [];
    this.totPlayer = 0;
  }

  addPlayer(name, conn) {
    var playersObj = {};
    var arr = (this.team1.concat(this.team2)).toString();
    playersObj['data'] = arr;
    // for (var i=0; i < arr.length; i++) {
    //   arr[i] = JSON.stringify(arr[i]);
    // }
    // playersObj['data'] =
    // console.log(playersObj);
    conn.send(JSON.stringify(playersObj));

    this.sendToAll({"id":"newPlayer", "name": name});

    if (this.totPlayer%2 == 0) {
      this.team1.push(new Player(name, conn));
    } else {
      this.team2.push(new Player(name, conn));
    }
    this.totPlayer++;

  }

  getPlayers() {
    var obj = {};
    obj['data'] = this.team1.slice();
    for (var i=0; i < this.team2.length; i++) {
      obj['data'].push(team2[i]);
    }

    return obj;
  }

  sendToAll (msg) {
    this.sendToTeam(msg, this.team1);
    this.sendToTeam(msg, this.team2);
  }

  sendToTeam (msg, team) {
    for (var i=0; i < team.lenght; i++) {
      team[i].conn.send(msg);
    }
  }

}

module.exports = Game;
