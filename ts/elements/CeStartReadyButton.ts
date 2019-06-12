/// <reference path='UpdateableElement.ts'/>

class CeStartReadyButton extends HTMLButtonElement {
    owner: boolean;
    constructor() {
        super();
        this.owner = userdata.uid == room.data.owner;
    }

    connectedCallback() {
        this.textContent = 'Start';
        this.classList.add('updateable-element');

        this.addEventListener('click', async e => {
            if (this.owner) {
                const token = await firebase.auth().currentUser.getIdToken(true)
                await easyPOST('startGame', { token, roomId: room.roomId })
                    .catch(e => {
                        console.log("INFO: Only the room owner can start the game!", e)
                    })
            } else {
                let readiness = room.data.players[userdata.uid].ready;
                // Update readiness in database
                db.collection('rooms').doc(room.roomId).set({ players: { [userdata.uid]: { ready: !readiness } } }, { merge: true })
            }
        })
    }

    update() {
        // if we own the room
        if (this.owner) {
            db.collection('rooms').doc(room.roomId).set({ players: { [userdata.uid]: { ready: true } } }, { merge: true })

            let allReady = true;

            for (let p in room.data.players) {
                if (!room.data.players[p].ready) allReady = false;
            }

            this.disabled = !allReady;

            allReady ? this.textContent = 'Start' : this.textContent = 'Waiting for players...';
        } else { this.textContent = room.data.players[userdata.uid].ready ? 'UnReady' : 'Ready' }
    }


}

customElements.define('ce-start-ready-button', CeStartReadyButton, { extends: 'button' });