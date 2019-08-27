/// <reference path='UpdateableElement.ts'/>

class CeStartReadyButton extends HTMLButtonElement {
    owner: boolean;
    constructor() {
        super();
        this.owner = userdata.uid == room.data.owner;
    }

    connectedCallback() {
        this.textContent = 'Start';
        this.classList.add('updateable-element', 'big', 'bottom');

        this.addEventListener('click', async e => {
            if (this.owner) {
                const token = await firebase.auth().currentUser.getIdToken(true)
                .catch(e=>{
                    errorPopUp('You appear offline! Please try again.');
                    console.error(e);
                })
                addLoader('playTime');

                const castGameSel = document.querySelector('#game-select') as HTMLSelectElement;
                const castRuleSel = document.querySelector('#rule-select') as HTMLSelectElement;

                await room.setup(castGameSel.value, castRuleSel.value);

                const started = await easyPOST('startGame', { token, roomId: room.roomId })
                    .catch(e => {
                        console.log("INFO: Only the room owner can start the game!", e)
                    })
                killLoader('playTime');
            } else {
                let readiness = room.data.players[userdata.uid].ready;
                // Update readiness in database
                firestore.collection('rooms').doc(room.roomId).set({ players: { [userdata.uid]: { ready: !readiness } } }, { merge: true })
            }
        })
    }

    update() {
        // if we own the room
        if (this.owner) {
            firestore.collection('rooms').doc(room.roomId).set({ players: { [userdata.uid]: { ready: true } } }, { merge: true })

            let allReady = true;

            for (let p in room.data.players) {
                if (!room.data.players[p].ready) allReady = false;
            }

            this.disabled = !allReady;

            if (allReady) {
                this.textContent = 'Start';
                this.style.backgroundColor = palette.green;
            } else {
                //this.textContent = 'Waiting for players...';
                this.textContent = 'Waiting...';// is this descriptive enough?
                this.style.backgroundColor = palette.grey;
            }

        } else {
            if (room.data.players[userdata.uid].ready) {
                this.textContent = 'UnReady';
                this.style.backgroundColor = palette.red;
            } else {
                this.textContent = 'Ready';
                this.style.backgroundColor = palette.green;
            }
        }
    }


}

customElements.define('ce-start-ready-button', CeStartReadyButton, { extends: 'button' });