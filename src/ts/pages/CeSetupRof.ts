/// <reference path='CePage.ts'/>

class CeSetupRof extends CePage {

    constructor() {
        super();
        this.header = 'account';
    }

    applyStyle() {

    }

    connectedCallback() {
        super.connectedCallback();
        // add elements to page

        // Room ID
        let roomId = document.createElement('h3');
        roomId.textContent = 'Room: '+GAME.roomId;
        this.appendChild(roomId);

        // Room PIN
        let roomPin = document.createElement('h3');
        roomPin.textContent = 'Pin: '+GAME.pin;
        this.appendChild(roomPin);

        // Players
        let playerList = new CePlayerList;
        playerList.classList.add('bigGrid')
        this.appendChild(playerList);

        // Start/Ready button

        let startButton = document.createElement('button');
        startButton.textContent = 'Start Game';

        startButton.addEventListener('click', async e => {
            // TODO if we are room owner
            // set state to playing
            if (GAME.playerOrder[0] === userdata.uid) {
                await firestore.collection('rooms').doc(GAME.roomId).set({state: 'playing'},{merge:true});
            } else {
                errorPopUp('Only room owner can start the gme! Current room owner is '+GAME.players[GAME.playerOrder[0]].name);
            }
        });

        startButton.classList.add('big','green');

        this.appendChild(startButton);



        // // Update DOM after joined
        // setTimeout(() => {
        //     updateDOM();
        // }, 500)
    }
}

customElements.define('ce-setup-rof', CeSetupRof);