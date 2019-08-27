/// <reference path='AbstractPlayPage.ts'/>

class CardPlayPage extends AbstractPlayPage {
    constructor() {
        super();
        let card = document.createElement('ce-card-display');

        this.page.appendChild(card);

        let rule = document.createElement('ce-rule-display');

        this.page.appendChild(rule);

        let pickCard = new CeDrawButton;//document.createElement('button');

        this.page.appendChild(pickCard);
    }
}