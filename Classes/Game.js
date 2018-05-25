class Player {
  constructor (name, conn) {
    this.conn = conn;
    this.name = name;
  }
}

class TabooCard {
  constructor(name, bannedWords) {
    this.cardName = name;
    this.banned = bannedWords;
  }

  getName() {
    return this.name;
  }

  getBannedWords() {
    return this.bannedWords;
  }
}

class Game {

  constructor () {
    this.team1 = [];
    this.team2 = [];
    this.totPlayer = 0;
    this.deck = [];

    const cards = require("../TabooCards.json");
    for (var i = 0; i < cards.tabooCards.length; i++) {
      this.deck.push(new TabooCard(cards.tabooCards[i].cardName,
                                   cards.tabooCards[i].banned));
    }
  }

  addPlayer(name, conn) {
    if (this.totPlayer%2 == 0) {
      this.team1.push(new Player(name, conn));
    } else {
      this.team2.push(new Player(name, conn));
    }
    this.totPlayer++;

    var obj = {'id': 'allPlayers'};
     obj['data'] = this.allPlayers();
    conn.send(JSON.stringify(obj));

    this.sendToAll(JSON.stringify({"id":"newPlayer", "name": name}), name);
  }

  removePlayer (conn) {
    var obj = {'id': 'allPlayers'};

    for (var i=0; i < this.team1.length; i++) {
      if (this.team1[i].conn == conn) {
        this.team1.splice(i, 1);
        this.totPlayer -= 1;

        if (this.totPlayer % 2 == 1) {
          this.team1.push(this.team2.pop());
        }

        obj['data'] = this.allPlayers();
        this.sendToAll(JSON.stringify(obj));
        return;
      }
    }

    for (var i=0; i < this.team2.length; i++) {
      if (this.team2[i].conn == conn) {
        this.team2.splice(i, 1);
        this.totPlayer -= 1;

        if (this.totPlayer % 2 == 0) {
          this.team2.push(this.team1.pop());
        }

        obj['data'] = this.allPlayers();
        this.sendToAll(JSON.stringify(obj));
        break;
      }
    }
  }

  allPlayers() {
    var arr = [];

    for (var i=0; i < Math.floor(this.totPlayer / 2); i++) {
      arr.push(this.team1[i].name);
      arr.push(this.team2[i].name);
    }
    if (this.totPlayer%2 == 1) {
      arr.push(this.team1[Math.floor(this.totPlayer / 2)].name);
    }

    return arr;
  }

  sendToAll (msg, name = "") {
    this.sendToTeam(msg, this.team1, name);
    this.sendToTeam(msg, this.team2, name);
  }

  sendToTeam (msg, team, name = "") {
    for (var i=0; i < team.length; i++) {
      if (team[i].name != name) team[i].conn.send(msg);
    }
  }
}

module.exports = Game;
