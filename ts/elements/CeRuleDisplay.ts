/// <reference path='UpdateableElement.ts'/>

class CeRuleDisplay extends UpdateableElement {
    ruleTitle;
    desc;

    constructor() {
        super();
    }

    applyStyle() {

    }

    connectedCallback() {
        super.connectedCallback();

        this.ruleTitle = document.createElement('p');
        this.desc = document.createElement('p');

        this.ruleTitle.textContent = '';
        this.desc.textContent = '';

        this.appendChild(this.ruleTitle);
        this.appendChild(this.desc);

        this.applyStyle();

    }

    update() {
        super.update();
        let cardNum = room.data.currentCard.number;
        let cardSuit = room.data.currentCard.suit;

        let rule = cardSuit=='joker'?room.data.rules.JK:room.data.rules[cardNum];

        if (rule) {
            this.ruleTitle.textContent = rule.title || '';
            this.desc.textContent = rule.desc || '';
        } else {
            console.error('No rule for ',cardNum,cardSuit);
        }
    }

}

customElements.define('ce-rule-display', CeRuleDisplay);