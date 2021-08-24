import { animMan, observer } from "../index.js";
import RingOfFire from "../class/RingOfFire.js";

import { gameHandler } from '../index.js';
import CustomElement from "./CustomElement.js";

export default class CeRule extends CustomElement {
    ruleTitle;
    desc;

    constructor() {
        super();
        observer.watch('ce-card', this.update.bind(this));
    }

    async connectedCallback() {
        await super.connectedCallback();

        this.ruleTitle = this.shadowRoot.querySelector('#title');
        this.desc = this.shadowRoot.querySelector('#desc');

        this.ruleTitle.textContent = '';
        this.desc.textContent = '';

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