/// <reference path='Page.ts'/>

class HomePage extends Page {
    constructor() {
        super();

        let top = document.querySelector('ce-topbar') as CeTopbar;
        top.show();
        
        let title = document.createElement('h1');

        title.textContent = `Hello${userdata.name ? ' ' + userdata.name : ''}.`;

        this.page.appendChild(title);

        let roomIdLabel = document.createElement('p');
        roomIdLabel.textContent = 'Room ID:';
        roomIdLabel.classList.add('label', 'big');
        let roomIdInput = document.createElement('input');
        roomIdInput.classList.add('big');

        let roomPassLabel = document.createElement('p');
        roomPassLabel.textContent = 'Room Pass:';
        roomPassLabel.classList.add('label', 'big');
        let roomPassInput = document.createElement('input');
        roomPassInput.classList.add('big');

        this.page.appendChild(roomIdLabel);
        this.page.appendChild(roomIdInput);

        this.page.appendChild(roomPassLabel);
        this.page.appendChild(roomPassInput);

        let btnJoin = document.createElement('button');
        btnJoin.textContent = 'Join';

        btnJoin.addEventListener('click', e => {
            e.preventDefault();
            
            let roomId = roomIdInput.value.toUpperCase();
            let roomPass = roomPassInput.value;

            // Validate input
            if (!roomId.match(/^[A-Z]{4}$/g)) {
                console.error('Room ID must be 4 letters!');
                errorPopUp('Room ID must be 4 characters!');
                return false;
            }

            if (!roomPass.match(/^\d{4}$/g)) {
                console.error('Room Pass must be 4 numbers!');
                errorPopUp('Room Pass must be 4 numbers!');
                return false;
            }

            loadMan.addLoader('roomJoined');

            // Hand validated input to join function
            return room.join([roomId, roomPass]);
        })

        btnJoin.classList.add('big');

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

        btnCreate.classList.add('big','green');

        this.page.appendChild(btnCreate);

    }
}