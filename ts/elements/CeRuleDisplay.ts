/// <reference path='UpdateableElement.ts'/>

class CeRuleDisplay extends UpdateableElement {
    ruleTitle;
    desc;

    constructor() {
        super();
    }

    applyStyle() {
        this.ruleTitle.style.opacity = 'inherit';
        this.desc.style.opacity = 'inherit';
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
        let cardNum = room.data.gamevars.currentCard.number;
        let cardSuit = room.data.gamevars.currentCard.suit;

        let rule = cardSuit=='joker'?room.data.gamevars.rules.JK:room.data.gamevars.rules[cardNum];

        if (rule) {
            animMan.animate(this,'fadeOut',250)
            .then(()=>{
                this.ruleTitle.textContent = rule.title || '';
                this.desc.textContent = rule.desc || '';
                animMan.animate(this,'wait',750)
                .then(()=>{
                    animMan.animate(this,'fadeIn',250)
                })
            })

        } else {
            console.error('No rule for ',cardNum,cardSuit);
        }
    }

}

customElements.define('ce-rule-display', CeRuleDisplay);