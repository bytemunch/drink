/// <reference path='UpdateableElement.ts'/>

class CeDrawButton extends HTMLButtonElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.textContent = 'Start';
        this.classList.add('updateable-element');

        this.addEventListener('click', async e => {
            if (room.data.state !== 'finished') {
                const token = await firebase.auth().currentUser.getIdToken(true);
                easyPOST('drawCard', { token, roomId: room.roomId })
                    .then(res => res.json())
                    .then(data => console.log(data))
            } else {
                openPage('finished');
            }
        })

        this.textContent = 'Card';
    }

    update() {
        if (room.data.state !== 'finished') {
            let nextPlayer = room.data.turnOrder[room.data.turnCounter] == userdata.uid;

            this.disabled = !nextPlayer;
        } else {
            this.textContent = 'Quit Game';
            this.disabled = false;
        }

        // if (nextPlayer) {
        //     this.disabled = false;
        // } else {
        //     this.disabled = true;
        // }
    }


}

customElements.define('ce-draw-button', CeDrawButton, { extends: 'button' });