/// <reference path='Page.ts'/>

class HomePage extends Page {
    constructor() {
        super();

        let title = document.createElement('h1');

        title.textContent = `Hello${userdata.name ? ' ' + userdata.name : ''}.`;

        this.page.appendChild(title);

        let roomIdLabel = document.createElement('p');
        roomIdLabel.textContent = 'Room ID:';
        let roomIdInput = document.createElement('input');

        let roomPassLabel = document.createElement('p');
        roomPassLabel.textContent = 'Room Pass:';
        let roomPassInput = document.createElement('input');

        this.page.appendChild(roomIdLabel);
        this.page.appendChild(roomIdInput);

        this.page.appendChild(roomPassLabel);
        this.page.appendChild(roomPassInput);

        let btnJoin = document.createElement('button');
        btnJoin.textContent = 'Join';

        btnJoin.addEventListener('click', e => {
            e.preventDefault();
            loadMan.addLoader('roomJoined');
            
            let roomId = roomIdInput.value.toUpperCase();
            let roomPass = roomPassInput.value;

            // Validate input
            if (!roomId.match(/^[A-Z]{4}$/g)) {
                console.error('Room ID must be 4 letters!');
                return false;
            }

            if (!roomPass.match(/^\d{4}$/g)) {
                console.error('Room Pass must be 4 numbers!');
                return false;
            }

            // Hand validated input to join function
            return room.join([roomId, roomPass]);
        })

        this.page.appendChild(btnJoin);

        let btnCreate = document.createElement('button');
        btnCreate.textContent = 'Create Room';

        btnCreate.addEventListener('click', async e => {
            e.preventDefault();
            loadMan.addLoader('roomJoined')
            let createdResult = await room.create();
            console.log(createdResult);
            await room.join([createdResult.roomId, "OWNER"]);
        })

        this.page.appendChild(btnCreate);

    }
}