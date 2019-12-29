class RingOfFire extends Game {
    type: string;
    deck: Deck;
    ruleset: RuleSet;
    currentCard: Card;

    constructor(x?, y?, z?) {
        super(x, y, z);
        GAME = this;
        this.type = 'rof';
        this.ruleset = new RuleSet('default');
        this.deck = new Deck;
        this.currentCard = new Card('', '');
    }

    //@ts-ignore
    async takeTurn() {

        let card;

        if (this.online) {
            card = await this.deck.drawOnline()
        } else {
            card = this.deck.drawCard();
            this.currentCard = card;
            updateDOM();
        }

        console.log(card);

        if (card.number === '' || card.suit === '' || card.err || !card) {
            errorPopUp(card.err);
            const drawButton = (<HTMLButtonElement>document.querySelector('#draw'));

            // Disable draw button
            drawButton.disabled = true;
            drawButton.classList.add('grey');

            return false;
        }

        super.takeTurn();

        if (this.ruleset.winState.if == 'LAST_KING') {
            if (card.number == 'K') {
                let kingFoundInDeck = false;
                for (let c of this.deck.cards) {
                    if (c.number == 'K') kingFoundInDeck = true;
                }

                if (!kingFoundInDeck) {
                    // end game
                    this.state = 'finished';

                    (<CeRule>document.querySelector('.rule-display')).update(this.ruleset.winState.then)
                }
            }
        }
        return card;
    }

    onListenerUpdate(newData, oldData) {
        // somehow update the dom once without causing spazzy shit
        // debouncing NOOOOOOOOOOOOOOOOOOOOO

        let newCard = newData.currentCard,
            oldCard = this.currentCard;

        if (newCard.suit != oldCard.suit || newCard.number != oldCard.number) {
            this.currentCard = newData.currentCard;
            (<CeCard>document.querySelector('ce-card')).update();
            (<CeRule>document.querySelector('ce-rule')).update();
        }


        super.onListenerUpdate(newData, oldData);

        (<CeNextPlayer>document.querySelector('ce-next-player')).update();


        const drawButton = (<HTMLButtonElement>document.querySelector('#draw'));

        if (drawButton && GAME.currentPlayer !== userdata.uid) {
            // Disable draw button
            drawButton.disabled = true;
            drawButton.classList.add('grey');
        } else {
            // enable draw button
            drawButton.disabled = false;
            drawButton.classList.remove('grey');
        }
    }
}