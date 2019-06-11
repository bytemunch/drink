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

        this.ruleTitle.textContent = 'Title';
        this.desc.textContent = 'Desc';

        this.appendChild(this.ruleTitle);
        this.appendChild(this.desc);

        this.applyStyle();

    }

    update() {
        super.update();
        let cardNum = room.data.currentCard.number;
        let rule = room.data.rules[cardNum];

        if (rule) {
            this.ruleTitle.textContent = rule.title || 'Title';
            this.desc.textContent = rule.desc || 'Desc';
        } else {
            console.error('No rule for ',cardNum);
        }
    }

}

customElements.define('ce-rule-display', CeRuleDisplay);