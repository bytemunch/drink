/// <reference path='RoomAbstract.ts'/>

class RoomRof extends RoomAbstract {
    constructor() {
        super();
    }

    async createLocal() {
        let usualRetVal = await super.createLocal();

        let deck = new Deck;
        let ruleset = new RuleSet('default');

        let fieldsToAdd = {
            gamevars: {
                currentCard: {},
                deck: deck.cards,
                rules: ruleset.rules,
                winState: ruleset.winState,
                gameType: 'ringoffire'
            }
        }

        try {
            await this.ref.set(fieldsToAdd, { merge: true });
        } catch (e) {
            console.error(e);
        }

        return usualRetVal;
    }
}