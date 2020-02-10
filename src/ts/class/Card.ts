export default class Card {
    suit: string;
    number: string;
    constructor(suit, number) {
        this.number = number;
        this.suit = suit;
    }
    get color() {
        // oooh big boy nested ternary
        // why tho
        // so illegible
        return this.suit == 'joker' ? Number(this.number) % 2 == 0 ? 'black' : 'red' : this.suit == 'clubs' || this.suit == 'spades' ? 'black' : 'red';
    }
}
