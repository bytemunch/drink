/// <reference path='UpdateableElement.ts'/>

class CeDrawButton extends HTMLButtonElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.textContent = 'Start';
        this.classList.add('updateable-element');

        this.addEventListener('click', async e=>{
            const token = await firebase.auth().currentUser.getIdToken(true);
            easyPOST('drawCard', {token, roomId:room.roomId})
            .then(res=>res.json())
            .then(data=>console.log(data))
        })

        this.textContent = 'Card';
    }

    update() {
        let nextPlayer = room.data.turnOrder[room.data.turnCounter] == userdata.uid;

        this.disabled = !nextPlayer;
        // if (nextPlayer) {
        //     this.disabled = false;
        // } else {
        //     this.disabled = true;
        // }
    }


}

customElements.define('ce-draw-button',CeDrawButton, {extends:'button'});