import CeMenu from "./CeMenu.js";
import { palette } from "../index.js";
import errorPopUp from "../functions/errorPopUp.js";
import CeActionSelectDiv from "./CeActionSelectDiv.js";
import RuleSet from "../class/RuleSet.js";

export default class CeRuleCreateMenu extends CeMenu {
    defaultRuleSet: RuleSet;
    titleInput: HTMLInputElement;
    ruleInput: HTMLTextAreaElement;
    cardSelector: HTMLSelectElement;
    newRuleSet: RuleSet;
    previousCard: string;

    constructor() {
        super();
    }

    applyStyle() {
        super.applyStyle();
    }

    connectedCallback() {
        super.connectedCallback();
        let title = document.createElement('h1');
        title.textContent = 'Create Ruleset';
        title.style.position = 'relative';
        title.style.pointerEvents = 'none';
        this.menu.appendChild(title);

        this.logoutBtn.style.display = 'none';

        // Select for card
        const cards = ["INFO", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "JK"];

        this.cardSelector = document.createElement('select');
        this.cardSelector.classList.add('big');
        this.cardSelector.style.backgroundColor = palette.blue;
        this.cardSelector.id = 'card-select';

        for (let c of cards) {
            let o = document.createElement('option');
            o.value = c;
            if (c == 'INFO') c = 'Ruleset Info';
            if (c == 'A') c = 'Ace';
            if (c == 'J') c = 'Jack';
            if (c == 'Q') c = 'Queen';
            if (c == 'K') c = 'King';
            if (c == 'JK') c = 'Joker';
            o.text = c;


            this.cardSelector.add(o);
        }

        this.menu.appendChild(this.cardSelector);

        // Text input for rule title
        this.titleInput = document.createElement('input');
        this.titleInput.classList.add('big');
        this.titleInput.style.color = palette.black;

        this.menu.appendChild(this.titleInput);

        // Text input for rule
        this.ruleInput = document.createElement('textarea');
        this.ruleInput.classList.add('big');
        this.ruleInput.style.color = palette.black;
        this.ruleInput.style.height = '50%';

        this.menu.appendChild(this.ruleInput)
        // this.ruleInput.style.backgroundColor = palette.blue;

        // Select all on first click
        // Normal textarea on successive clicks

        this.defaultRuleSet = new RuleSet('default');
        this.newRuleSet = new RuleSet('empty');
        this.previousCard = 'INFO';

        this.cardSelector.addEventListener('change', e => {
            this.update();
        });

        // Action editing
        let actionSelectDiv = new CeActionSelectDiv;
        this.menu.appendChild(actionSelectDiv);
        actionSelectDiv.style.display = 'none';

        // Update Button
        let updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.style.backgroundColor = palette.blue;
        updateButton.classList.add('big', 'bottom');

        updateButton.addEventListener('click', () => {
            this.update();

            // Check for lack of title
            if (!this.newRuleSet.rules["INFO"].title) {
                errorPopUp("Please enter a new title for your ruleset in Ruleset Info.");
                return;
            }

            // Fill empty spaces with default rules here
            for (let r in this.newRuleSet.rules) {
                let fillerTitle;
                let fillerDesc;
                let actionObj = {
                    target:'',
                    type:'',
                    trigger:'',
                };

                fillerTitle = this.newRuleSet.rules[r].title ? this.newRuleSet.rules[r].title : this.defaultRuleSet.rules[r].title;
                fillerDesc = this.newRuleSet.rules[r].desc ? this.newRuleSet.rules[r].desc : this.defaultRuleSet.rules[r].desc;

                actionObj.target = this.newRuleSet.rules[r].action.target ? this.newRuleSet.rules[r].action.target : this.defaultRuleSet.rules[r].action.target;
                actionObj.trigger = this.newRuleSet.rules[r].action.trigger ? this.newRuleSet.rules[r].action.trigger : this.defaultRuleSet.rules[r].action.trigger;
                actionObj.type = this.newRuleSet.rules[r].action.type ? this.newRuleSet.rules[r].action.type : this.defaultRuleSet.rules[r].action.type;
                
                this.newRuleSet.setRule(r, fillerTitle, fillerDesc, actionObj);
            }

            console.table(this.newRuleSet.rules);
        })

        this.menu.appendChild(updateButton);

        this.update();

        this.applyStyle();
    }

    update() {

        let actionTypeSelect = (<HTMLSelectElement>document.querySelector('#type-select'));
        let actionTriggerSelect = (<HTMLSelectElement>document.querySelector('#trigger-select'))
        let actionTargetSelect = (<HTMLSelectElement>document.querySelector('#target-select'))

        // Add entered rule to newruleset
        if (this.ruleInput.value != this.defaultRuleSet.rules[this.previousCard].desc
            || this.titleInput.value != this.defaultRuleSet.rules[this.previousCard].title) {

            let actionObject = this.newRuleSet.createAction(actionTypeSelect.value, actionTriggerSelect.value, actionTargetSelect.value)
            
            this.newRuleSet.setRule(this.previousCard, this.titleInput.value, this.ruleInput.value, actionObject)
        }

        // Setup selected card display
        let card = this.cardSelector.value;
        // If no new rule entered fill textarea with default
        // else fill with newruleset
        this.titleInput.value = this.newRuleSet.rules[card].title || this.defaultRuleSet.rules[card].title;
        this.ruleInput.value = this.newRuleSet.rules[card].desc || this.defaultRuleSet.rules[card].desc;
        actionTargetSelect.value = this.newRuleSet.rules[card].action.target || this.defaultRuleSet.rules[card].action.target;
        actionTypeSelect.value = this.newRuleSet.rules[card].action.type || this.defaultRuleSet.rules[card].action.type;
        actionTriggerSelect.value = this.newRuleSet.rules[card].action.trigger || this.defaultRuleSet.rules[card].action.trigger;


        // Set previous card for when card changes next
        this.previousCard = card;
    }
}

// customElements.define('ce-rule-create-menu', CeRuleCreateMenu);