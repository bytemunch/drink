class RingOfFire extends Game {
    type:string;
    deck:Deck;
    ruleset:RuleSet;
    currentCard:Card;
    

    constructor() {
        super();
        GAME = this;
        this.type = 'rof';
        this.ruleset = new RuleSet('default');
        this.deck = new Deck;
    }

    //@ts-ignore
    async takeTurn() {
        super.takeTurn();

        let card = this.deck.drawCard()

        this.currentCard = card;

        if (this.ruleset.winState.if == 'LAST_KING') {
            if (card.number == 'K') {
            let kingFoundInDeck = false;
                for (let c of this.deck.cards) {
                    if (c.number == 'K') kingFoundInDeck = true;
                }

                if (!kingFoundInDeck) {
                    // end game
                    this.state = 'finished';
                    
                    (<CeOfflineRule>document.querySelector('.rule-display')).update(this.ruleset.winState.then)
                }
            }
        }


        return card;
    }
}