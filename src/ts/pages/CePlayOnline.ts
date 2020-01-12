/// <reference path='CePage.ts'/>

class CePlayOnline extends CePage {
    constructor() {
        super();
        this.header = 'account';
    }

    applyStyle() {

    }

    connectedCallback() {
        super.connectedCallback();

        // check if not signed in; redirect to login if not
        if (firebase.auth().currentUser === null) {
            goToPage('ce-login');
        }

        // add elements to page

        let roomInput = document.createElement('input');
        roomInput.id = 'room-input';
        roomInput.classList.add('big');
        let roomLabel = document.createElement('p');
        roomLabel.classList.add('big','label');
        roomLabel.textContent = 'Room ID:';

        this.appendChild(roomLabel);
        this.appendChild(roomInput);

        let pinInput = document.createElement('input');
        pinInput.id = 'pin-input';
        pinInput.classList.add('big');
        let pinLabel = document.createElement('p');
        pinLabel.classList.add('big','label');
        pinLabel.textContent = 'Room PIN:';

        this.appendChild(pinLabel);
        this.appendChild(pinInput);


        let joinButton = document.createElement('button');
        joinButton.textContent = 'Join Room';

        joinButton.addEventListener('click', e => {
            console.log('Join button pressed!');
            GAME = new RingOfFire(true);
            GAME.roomId = roomInput.value.toUpperCase();
            GAME.pin = pinInput.value;
            GAME.initOnline(false)
            .then(roomJoined=>{
                if (roomJoined.joined) {
                    goToPage('ce-setup-rof');
                } else {
                    errorPopUp(roomJoined.error.err);
                }
            })
        });

        joinButton.classList.add('big');

        this.appendChild(joinButton);

        let createButton = document.createElement('button');
        createButton.textContent = 'Create Room';

        createButton.addEventListener('click', e => {
            console.log('Create button pressed!');
            GAME = new RingOfFire(true);
            GAME.roomId = GAME.createId();
            GAME.pin = GAME.createPin();
            GAME.initOnline(true)
            .then(roomJoined=>{
                if (roomJoined.joined) {
                    goToPage('ce-setup-rof');
                } else {
                    errorPopUp(roomJoined.error.err);
                }
            })
            .catch(e=>{
                console.error(e);
            })
        });

        createButton.classList.add('big','green');

        this.appendChild(createButton);


        let backButton = document.createElement('button');
        backButton.textContent = 'Back';

        backButton.addEventListener('click', e => {
            console.log('Back button pressed!');
            goToPage('ce-home-page');
        });

        backButton.classList.add('big','red');

        this.appendChild(backButton);
    }
}

customElements.define('ce-play-online',CePlayOnline);