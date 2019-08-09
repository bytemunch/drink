/// <reference path='UpdateableElement.ts'/>

class CeDrawButton extends HTMLButtonElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.textContent = 'Start';
        this.classList.add('updateable-element', 'big', 'bottom');

        this.addEventListener('click', async e => {
            if (room.data.state !== 'finished') {
                this.disable('Drawing...');
                // Discard immediately to seem faster
                //await (<CeCardDisplay>document.querySelector('ce-card-display')).discard();
                const token = await firebase.auth().currentUser.getIdToken(true)
                    .catch(e => {
                        errorPopUp('You appear offline! Please try again.');
                        console.error(e);
                    });
                easyPOST('drawCard', { token, roomId: room.roomId })
                    .then(res => res.json())
                    .then(data => console.log(data))
                //.then(()=>this.enable('Card'))
            } else {
                room.leave();
            }
        })

        this.textContent = 'Card';
    }

    disable(msg) {
        this.disabled = true;
        this.classList.add('grey')
        this.textContent = msg;
    }

    enable(msg) {
        this.disabled = false;
        this.classList.remove('grey')
        this.textContent = msg;
    }

    update() {
        if (room.data.state !== 'finished') {
            const nextPlayerIndex = room.data.turnCounter % room.data.turnOrder.length;
            const nextUid = room.data.turnOrder[nextPlayerIndex];
            
            if (nextUid == userdata.uid || nextUid.substring(0,nextUid.length-1) == userdata.uid) {
                this.enable('Card');
            } else {
                this.disable('Waiting...');
            }
        } else {
            this.style.backgroundColor = palette.red;
            this.enable('Leave Game');
        }
    }


}

customElements.define('ce-draw-button', CeDrawButton, { extends: 'button' });