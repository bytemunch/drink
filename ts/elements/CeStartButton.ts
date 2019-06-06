/// <reference path='UpdateableElement.ts'/>

class CeStartButton extends HTMLButtonElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.textContent = 'Start';
        this.classList.add('updateable-element');
    }

    update() {
        let ready = true;

        for (let p in room.data.players) {
            if (!room.data.players[p].ready) ready = false;
        }

        if (ready) {
            this.disabled = false;
        } else {
            this.disabled = true;
        }
    }


}

customElements.define('ce-start-button',CeStartButton, {extends:'button'});