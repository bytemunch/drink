
interface ICard {
    suit: string,
    number: string
}

export class Deck {
    public cards: Array<ICard> = [];
    constructor(private jokercount: number = 2) {
        const numbers = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "JK"];
        const suits = ["clubs", "diamonds", "hearts", "spades"];
        for (let n of numbers) {
            if (n != "JK") {
                for (let s of suits) {
                    this.cards.push({ suit: s, number: n });
                }
            }
            else {
                for (let i = 0; i < this.jokercount; i++) {
                    this.cards.push({ suit: 'joker', number: i.toString() });
                }
            }
        }
    }
}
