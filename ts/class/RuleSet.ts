
interface IAction {
    type: string;
    trigger: string;
    target: string;
}

class RuleSet {
    public rules: Object;
    public winState: Object;

    constructor(ruleset) {
        this.rules = {};
        switch (ruleset) {
            case 'IRL':
            default:
                this.setupIRL();
        }
    }

    addRule(card: string, title: string, desc: string, action: IAction) {
        this.rules[card] = { title, desc, action };
    }

    createAction(type: string, trigger: string, target: string) {
        return { type, trigger, target };
    }
    
    setupIRL() {
        this.addRule('A', 'Waterfall', 'Card picker starts drinking, then the next player, then the next and so on. Card picker can stop when they feel, each next player may only stop when the previous player has. Like a waterfall.', this.createAction('IRL', 'Immediate', 'All'));
        this.addRule('2', 'Choose', 'Choose a player to drink. There\'ll be a popup here one day', this.createAction('Target', 'Immediate', 'Choose'));
        this.addRule('3', 'Me', 'Current player drinks. This will show the player\'s name here one day', this.createAction('Target', 'Immediate', 'Self'));
        this.addRule('4', 'Whores', 'Girls drink!', this.createAction('Target', 'Immediate', 'Females'));
        this.addRule('5', 'Thumb Master', 'I cannot be bothered describing this did you see how long winded waterfall was??', this.createAction('IRL', 'User', 'Choose'));
        this.addRule('6', 'Dicks', 'Boys drink! BOOOOOOYS', this.createAction('Target', 'Immediate', 'Males'));
        this.addRule('7', 'Heaven', 'Card picker can throw an arm up to heaven, last to copy drinks.', this.createAction('IRL', 'User', 'Choose'));
        this.addRule('8', 'Mate', 'Choose a mate to drink when you drink!', this.createAction('Target', 'Immediate', 'Mate'));
        this.addRule('9', 'Bust a Rhyme', 'Start with a word. The next player must say a rhyming word, and then next player, and so on. Whoever repeats a word or doesn\'t rhyme, drink!', this.createAction('IRL', 'Immediate', 'Vote'));
        this.addRule('10', 'Categories', 'Current player chooses a category, each player says a word withing that category until a hesitation or repetition. Drink when you do either of those things.', this.createAction('IRL', 'Immediate', 'Vote'));
        this.addRule('J', 'Make a Rule', 'Hmm. Wonder what this one means.', this.createAction('IRL', 'User', 'Choose'));
        this.addRule('Q', 'Question Master', 'The player who picked this card is the Question Master. If you answer one of their questions without first saying "Fuck off, QuestionMaster" or some variation of that, you drink.', this.createAction('IRL', 'User', 'Choose'));
        this.addRule('K', 'Pour', 'Stick a bit of your drink in the dirty pint cup.', this.createAction('IRL', 'Immediate', 'Self'));
        this.addRule('JK', 'Travolta', 'Dance time L0l', this.createAction('IRL', 'User', 'Choose'));
        this.winState = { if: 'LAST_KING', then: { action: this.createAction('IRL', 'Immediate', 'Self'), desc: 'Down the middle cup!' } };
    }
}
