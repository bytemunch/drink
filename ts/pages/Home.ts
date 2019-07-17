/// <reference path='Page.ts'/>

class HomePage extends Page {
    constructor() {
        super();

        let topbar = document.createElement('ce-topbar')
        this.page.appendChild(topbar);
        
        let title = document.createElement('h1');

        title.style.whiteSpace = 'nowrap';
        title.style.fontSize = 'large';

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
            return room.join(roomId, roomPass)
            .catch(e=>console.error(e))
        })

        btnJoin.classList.add('big');

        this.page.appendChild(btnJoin);

        let btnCreate = document.createElement('button');
        btnCreate.textContent = 'Create Room';

        btnCreate.addEventListener('click', async e => {
            e.preventDefault();
            loadMan.addLoader('roomJoined')

            const id = roomIdInput.value;

            let createdId = await room.createLocal();

            console.log(createdId);

            if (createdId.err) {
                errorPopUp(createdId.err);
            }

            await room.join(createdId.id, "OWNER")
            .catch(e=>console.error(e));
        })

        btnCreate.classList.add('big','green');

        this.page.appendChild(btnCreate);

    }
}