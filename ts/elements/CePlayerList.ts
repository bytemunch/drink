/// <reference path='UpdateableElement.ts'/>

class CePlayerList extends UpdateableElement {    
    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
    }

    update() {
        super.update();
        console.log('updated',this)
    }
}

customElements.define('ce-player-list', CePlayerList);