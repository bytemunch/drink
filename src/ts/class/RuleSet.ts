interface IAction {
    type: string;
    trigger: string;
    target: string;
}

export default class RuleSet {
    public rules: Object;
    public winState: {if:string,then:{action:{},desc:string,title:string}};


    constructor(ruleset) {
        this.rules={};
        const cards = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "JK"];

        for (let c of cards) {
            this.rules[c] = {title:'',desc:'',action:{target:'',type:'',trigger:''}}
        }

        switch (ruleset) {
            case 'empty':
                break;
            case 'IRL':
            case 'default':
            default:
                this.setupIRL();
                break;
        }
    }

    setRule(card: string, title: string, desc: string, action?: IAction) {
        if (!action) action = this.createAction('irl', 'immediate', 'all');
        this.rules[card] = { title, desc, action };
    }

    createAction(type: string, trigger: string, target: string) {
        return { type, trigger, target };
    }

    setupIRL() {
        this.setRule('INFO', 'Default', 'Sam\'s default ruleset.');
        this.setRule('A', 'Waterfall', 'Card picker starts drinking, then the next player, then the next and so on. Card picker can stop when they feel, each next player may only stop when the previous player has. Like a waterfall.',
            this.createAction('irl', 'immediate', 'all'));
        this.setRule('2', 'Choose', 'Choose a player to drink. There\'ll be a popup here one day',
            this.createAction('target', 'immediate', 'choose'));
        this.setRule('3', 'Me', 'Current player drinks. This will show the player\'s name here one day',
            this.createAction('target', 'immediate', 'self'));
        this.setRule('4', 'Whores', 'Girls drink!',
            this.createAction('target', 'immediate', 'girls'));
        this.setRule('5', 'Thumb Master', 'Card picker sticks a thumb on the table, last to copy has to drink.',
            this.createAction('irl', 'player', 'choose'));
        this.setRule('6', 'Dicks', 'Boys drink! BOOOOOOYS',
            this.createAction('target', 'immediate', 'guys'));
        this.setRule('7', 'Heaven', 'Card picker can throw an arm up to heaven, last to copy drinks.',
            this.createAction('irl', 'player', 'choose'));
        this.setRule('8', 'Mate', 'Choose a mate to drink when you drink!',
            this.createAction('target', 'immediate', 'choose'));
        this.setRule('9', 'Bust a Rhyme', 'Start with a word. The next player must say a rhyming word, and then next player, and so on. Whoever repeats a word or doesn\'t rhyme, drink!',
            this.createAction('irl', 'immediate', 'vote'));
        this.setRule('10', 'Categories', 'Current player chooses a category, each player says a word withing that category until a hesitation or repetition. Drink when you do either of those things.',
            this.createAction('irl', 'immediate', 'vote'));
        this.setRule('J', 'Make a Rule', 'Hmm. Wonder what this one means.',
            this.createAction('irl', 'player', 'choose'));
        this.setRule('Q', 'Question Master', 'The player who picked this card is the Question Master. If you answer one of their questions without first saying "Fuck off, QuestionMaster" or some variation of that, you drink.',
            this.createAction('irl', 'player', 'choose'));
        this.setRule('K', 'Pour', 'Stick a bit of your drink in the dirty pint cup.',
            this.createAction('irl', 'immediate', 'self'));
        this.setRule('JK', 'Travolta', 'Dance time L0l',
            this.createAction('irl', 'player', 'choose'));
        this.winState = {
            if: 'LAST_KING', then: {
                action:
                    this.createAction('irl', 'immediate', 'self'),
                    desc: 'Down the middle cup!',
                    title: 'Down It!'
            }
        };
    }
}
