import UpdateableElement from "./UpdateableElement.js";
import { animMan } from "../index.js";
import RingOfFire from "../class/RingOfFire.js";

import {gameHandler} from '../index.js';

export default class CeRule extends UpdateableElement {
    ruleTitle;
    desc;

    constructor() {
        super();
    }

    applyStyle() {
        this.classList.add('rule-display');

        this.style.width = '100%';

        this.style.display = 'block';

        this.ruleTitle.style.opacity = 'inherit';
        this.desc.style.opacity = 'inherit';

        this.style.position = 'absolute';

        this.style.bottom = '64px';

    }

    connectedCallback() {
        super.connectedCallback();

        this.ruleTitle = document.createElement('p');
        this.desc = document.createElement('p');

        this.ruleTitle.textContent = '';
        this.desc.textContent = '';

        this.shadowRoot.appendChild(this.ruleTitle);
        this.shadowRoot.appendChild(this.desc);

        this.applyStyle();

    }

    update(rule?) {
        super.update();

        let castGame = gameHandler.gameObject as RingOfFire;

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