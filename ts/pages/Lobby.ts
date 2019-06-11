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
        playerInfo.classList.add('bigGrid');
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

        let startButton = new CeStartButton;//document.createElement('ce-start-button');

        startButton.addEventListener('click', async e=>{
            // TODO this is NOT safe. trusts client.
            // Pull room owner from database again here?
            if (userdata.uid == room.data.owner) {
                console.log("Start game now!");

                const token = await firebase.auth().currentUser.getIdToken(true)
                const result = easyPOST('startGame', { token, roomId:room.roomId })
                console.log(result);

            } else {
                console.log("INFO: Only the room owner can start the game!")
            }
        })

        this.page.appendChild(startButton);

    }
}