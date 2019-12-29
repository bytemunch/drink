
class Deck {
    public cards: Array<Card> = [];
    constructor(private jokercount: number = 2) {
        const numbers = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "JK"];
        // const numbers = ["K", "JK"];
        const suits = ["clubs", "diamonds", "hearts", "spades"];
        for (let n of numbers) {
            if (n != "JK") {
                for (let s of suits) {
                    this.cards.push(new Card(s, n));
                }
            }
            else {
                for (let i = 0; i < this.jokercount; i++) {
                    this.cards.push(new Card('joker', i.toString()));
                }
            }
        }
    }

    drawCard(discard: boolean = true) {
        let n = Math.floor(Math.random() * this.cards.length);
        let chosenCard = this.cards[n];

        if (discard) this.cards.splice(n, 1);

        return chosenCard;
    }

    async drawOnline() {
        return (await easyPOST('rofDrawCard',{token:await firebase.auth().currentUser.getIdToken(true) ,roomId:GAME.roomId})).json();
    }
}
