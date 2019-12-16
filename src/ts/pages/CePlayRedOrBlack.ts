/// <reference path='CePage.ts'/>

class CePlayRedOrBlack extends CePage {
    
    constructor() {
        super();
        this.header = 'account';
    }

    applyStyle() {

    }

    connectedCallback() {
        super.connectedCallback();
        // add elements to page

        // Card display
        let cardDisplay = new CeOfflineCard;
        this.appendChild(cardDisplay);
    }
}

customElements.define('ce-play-red-or-black',CePlayRedOrBlack);