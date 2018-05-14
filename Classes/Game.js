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

}

module.exports = Game;
