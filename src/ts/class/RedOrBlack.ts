import Card from "./Card.js";
import Game from "./Game.js";
import Deck from "./Deck.js";

export default class RedOrBlack extends Game {
    deck: Deck;

    cardPot: Array<Card>;

    placedBet: string;

    turnProgress: string;
    // ReadyUp
    // PlaceBet
    // DrawCards
    // CheckWin
    // <?> Drink
    // Finished

    constructor() {
        super();
        this.type = 'red-or-black';
        this.deck = new Deck;
        this.cardPot = [];
        this.turnProgress = 'ReadyUp';
    }

    readyUp() {
        // remove ready screen
        this.turnProgress = 'PlaceBet';
    }

    placeBet(bet: string) {
        this.placedBet = bet;
        this.turnProgress = 'DrawCards';
    }

    //@ts-ignore some bullshit about type unsafe overloading idfc
    async takeTurn(): Array<Card> {
        super.takeTurn();
        let cards: Array<Card> = [];

        let cardCount = this.placedBet.length <= this.deck.cards.length ? this.placedBet.length : this.deck.cards.length;
        // Choose cardCount number of cards and return them
        for (let i = 0; i < cardCount; i++) {
            let card = this.deck.drawCard(true);
            cards.push(card);
            this.cardPot.push(card);
        }

        this.turnProgress = 'CheckWin';

        return cards;
    }

    // bet:
    // 'RB' 'RR' 'BB' 'R' 'B' 'RRBB' or any permutation of.
    checkWin(bet: string, cards: Array<Card>, ordered: boolean = false): boolean {
        if (ordered) {
            for (let i = 0; i < cards.length; i++) {
                let color = bet[i] == 'R' ? 'red' : 'black';
                if (color != cards[i].color) return false;
            }
        } else {
            for (let c of cards) {
                let colorToken = c.color[0].toUpperCase();
                let tokenPos = bet.search(colorToken);
                if (tokenPos == -1) return false;
    
                bet = bet.replace(colorToken,'');
            }
        }

        return !bet;
    }

    clearPot() {
        this.cardPot = [];
    }
}