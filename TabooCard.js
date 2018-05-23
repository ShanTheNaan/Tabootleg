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

const cards = require("./TabooCards.json");

var cardDeck = [];

for (var i = 0; i < cards.tabooCards.length; i++) {
  cardDeck.push(new TabooCard(cards.tabooCards[i].cardName,
                          cards.tabooCards[i].banned));
}

console.log(cardDeck);
