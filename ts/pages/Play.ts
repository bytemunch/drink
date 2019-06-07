/// <reference path='Page.ts'/>

class PlayPage extends Page {
    constructor() {
        super();

        let title = document.createElement('h1');

        title.textContent = `Play`;

        this.page.appendChild(title);

        let pickCard = document.createElement('button');

        pickCard.addEventListener('click', async e=>{
            const token = await firebase.auth().currentUser.getIdToken(true);
            easyPOST('drawCard', {token, roomId:room.roomId})
            .then(res=>console.log(res.json()))

        })

        pickCard.textContent = 'Card';

        this.page.appendChild(pickCard);
    }
}