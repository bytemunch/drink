/// <reference path='UpdateableElement.ts'/>

class CeRule extends UpdateableElement {
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
        this.style.top = (document.querySelector('.card-display > img').getBoundingClientRect().bottom + 10) + 'px';

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

        let castGame = GAME as RingOfFire;

        if (!castGame.currentCard || castGame.currentCard.number == '') {
            console.error('No card in game');
            return false;
        }

        let cardNum = castGame.currentCard.number || '';
        let cardSuit = castGame.currentCard.suit || '';

        if (!rule) {
            rule = cardSuit == 'joker' ? castGame.ruleset.rules['JK'] : castGame.ruleset.rules[cardNum] || '';
        }

        if (rule) {
            animMan.animate(this, 'fadeOut', 250)
                .then(() => {
                    this.ruleTitle.textContent = rule.title || '';
                    this.desc.textContent = rule.desc || '';
                    animMan.animate(this, 'wait', 750)
                        .then(() => {
                            animMan.animate(this, 'fadeIn', 250)
                        })
                })
        } else {
            console.error('No rule for ', cardNum, cardSuit);
        }
    }

}

customElements.define('ce-rule', CeRule);