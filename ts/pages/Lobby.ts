/// <reference path='Page.ts'/>

class LobbyPage extends Page {
    constructor() {
        super();

        let title = document.createElement('h1');

        title.textContent = `Lobby.`;

        this.page.appendChild(title);

        
        let roomDisplay = document.createElement('h2');
        roomDisplay.style.display = 'inline';
        roomDisplay.style.cssFloat = 'left';
        roomDisplay.style.paddingLeft = '3vw';

        roomDisplay.textContent = `Room: ${room.roomId}`;
        this.page.appendChild(roomDisplay);

        let pin = document.createElement('h2');
        pin.style.display = 'inline';
        pin.style.cssFloat = 'right';
        pin.style.paddingRight = '5vw';


        pin.textContent = `PIN: ${room.data.pin}`;
        this.page.appendChild(pin);

        let playerInfo = document.createElement('ce-player-list');
        this.page.appendChild(playerInfo);

        let readyButton = document.createElement('button');
        readyButton.textContent = room.data.players[userdata.uid].ready?'UnReady':'Ready';

        readyButton.addEventListener('click', async e=>{
            e.preventDefault();
            let readiness = room.data.players[userdata.uid].ready;
            // Update readiness in database
            await db.collection('rooms').doc(room.roomId).set({players:{[userdata.uid]:{ready:!readiness}}}, {merge:true});
            readyButton.textContent = readiness?'Ready':'UnReady';

        })

        this.page.appendChild(readyButton);

    }
}