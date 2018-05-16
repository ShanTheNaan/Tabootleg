class Player {
  constructor (name, conn) {
    this.conn = conn;
    this.name = player;
  }
}

class Game {

  constructor () {
    this.team1 = [];
    this.team2 = [];
    this.totPlayer = 0;
  }

  addPlayer(name, conn) {
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

}

module.exports = Game;
