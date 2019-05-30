class CePlayerList extends HTMLElement {    
    constructor() {
        super();

        this.addEventListener('update', e=>{
            console.log('Updated!');
        })
    }
}