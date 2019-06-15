/// <reference path='UpdateableElement.ts'/>

class CeDrawButton extends HTMLButtonElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.textContent = 'Start';
        this.classList.add('updateable-element', 'big');

        this.addEventListener('click', async e => {
            if (room.data.state !== 'finished') {
                this.disable('Drawing...');
                const token = await firebase.auth().currentUser.getIdToken(true);
                easyPOST('drawCard', { token, roomId: room.roomId })
                    .then(res => res.json())
                    .then(data => console.log(data))
                    .then(()=>this.enable())
            } else {
                openPage('finished');
            }
        })

        this.textContent = 'Card';
    }

    disable(msg) {
        this.disabled = true;
        this.classList.add('grey')
        this.textContent = msg;
    }

    enable() {
        this.disabled = false;
        this.classList.remove('grey')
        this.textContent = 'Card';
    }

    update() {
        if (room.data.state !== 'finished') {
            let nextPlayer = room.data.turnOrder[room.data.turnCounter] == userdata.uid;

            nextPlayer?this.enable():this.disable('Waiting...')
        } else {
            this.textContent = 'Quit Game';
            this.enable();
        }
    }


}

customElements.define('ce-draw-button', CeDrawButton, { extends: 'button' });