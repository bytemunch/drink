/// <reference path='UpdateableElement.ts'/>

class CeOfflineRule extends UpdateableElement {
    ruleTitle;
    desc;

    constructor() {
        super();
    }

    applyStyle() {
        this.classList.add('rule-display');

        this.ruleTitle.style.opacity = 'inherit';
        this.desc.style.opacity = 'inherit';

        this.style.position = 'relative';
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

    update(rule?) {
        super.update();
        this.style.top = document.querySelector('.card-display > img').getBoundingClientRect().bottom + 'px';
        let cardNum = GAME.currentCard.number || 'nocard';
        let cardSuit = GAME.currentCard.suit || 'nocard';

        console.log(rule);

        if (!rule) {
            rule = cardSuit=='joker'?GAME.ruleset.rules.JK:GAME.ruleset.rules[cardNum]||'';
        }

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

customElements.define('ce-offline-rule', CeOfflineRule);