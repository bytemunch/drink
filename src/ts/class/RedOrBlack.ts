import Card from "./Card.js";
import Game from "./Game.js";
import Deck from "./Deck.js";
import PgPlayRedOrBlack from "../pages/PgPlayRedOrBlack.js";

export default class RedOrBlack extends Game {
    deck: Deck;

    cardPot: Array<Card>;

    currentCards: Card[];

    placedBet: string;

    constructor(online) {
        super(online);
        this.type = 'red-or-black';
        this.deck = new Deck;
        this.cardPot = [];
        this.currentCards = [];
    }

    //@ts-ignore some bullshit about type unsafe overloading idfc
    async takeTurn(bet: string): Promise<Card[]> {

        let cards: Array<Card> = [];

        this.placedBet = bet || '';

        let cardCount = this.placedBet.length <= this.deck.cards.length ? this.placedBet.length : this.deck.cards.length;
        // Choose cardCount number of cards and return them
        for (let i = 0; i < cardCount; i++) {
            let card = this.deck.drawCard(true);
            cards.push(card);
            this.cardPot.push(card);
        }

        if (this.online) {
            this.batchFirebase({
                currentCards: cards,
                cardPot: this.cardPot,
                placedBet: bet
            })
        }

        super.takeTurn();

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
                let _c = new Card(c.suit, c.number);
                let colorToken = _c.color[0].toUpperCase();
                let tokenPos = bet.search(colorToken);
                if (tokenPos == -1) return false;

                bet = bet.replace(colorToken, '');
            }
        }

        return !bet;
    }

    clearPot() {
        this.cardPot = [];
    }

    async onListenerUpdate(newData, oldData) {
        let castView = (<PgPlayRedOrBlack>this.view);
        if (this.state == 'playing') {
            this.turn = newData.turn;

            function sameCards(a:Card[], b:Card[]) {
                if (a.length !== b.length) return false;

                for (let i=0;i<a.length;i++) {
                    if (a[i].suit !== b[i].suit) return false;
                    if (a[i].number !== b[i].number) return false;
                }

                return true;
            }

            if (!sameCards(oldData.currentCards , newData.currentCards)) {
                this.currentCards = newData.currentCards;

                await castView.drawCards(this.currentCards);
                await castView.discard();

                // check win
                if (!this.checkWin(newData.placedBet, this.currentCards)) {
                    // loss
                    castView.drinkPopUp(this);
                    this.clearPot();
                } else {
                    // win
                    this.cardPot = newData.cardPot;
                }

                castView.potCount.update();
                castView.enableButtons();
            }
        } else if (newData.state == 'playing') {
            // go to play page
        }
    }
}