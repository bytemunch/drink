import Card from "./Card.js";
import Game from "./Game.js";
import Deck from "./Deck.js";
import PgPlayRedOrBlack from "../pages/PgPlayRedOrBlack.js";

export default class RedOrBlack extends Game {
    deck: Deck;

    cardPot: Array<Card>;

    currentCards: Card[];

    placedBet: string;

    turnProgress: string;
    // ReadyUp
    // PlaceBet
    // DrawCards
    // CheckWin
    // <?> Drink
    // Finished

    constructor(online) {
        super(online);
        this.type = 'red-or-black';
        this.deck = new Deck;
        this.cardPot = [];
        this.currentCards = [];
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
    async takeTurn(): Promise<Card[]> {
        super.takeTurn();

        this.currentCards = [];

        let cards: Array<Card> = [];

        let cardCount = this.placedBet.length <= this.deck.cards.length ? this.placedBet.length : this.deck.cards.length;
        // Choose cardCount number of cards and return them
        for (let i = 0; i < cardCount; i++) {
            let card = this.deck.drawCard(true);
            cards.push(card);
            this.currentCards.push(card);
            this.cardPot.push(card);
        }

        this.turnProgress = 'CheckWin';

        if (this.online) this.updateFirebase({
            currentCards: this.currentCards,
            cardPot: this.cardPot
        })

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

    onListenerUpdate(oldData, newData) {

        if (this.state == 'playing') {
            if (oldData.currentCards != newData.currentCards) {
                (<PgPlayRedOrBlack>this.view).drawCards(newData.currentCards);
                this.currentCards = newData.currentCards;
                // check win
            }
        } else if (newData.state == 'playing') {
            // go to play page
        }
    }
}