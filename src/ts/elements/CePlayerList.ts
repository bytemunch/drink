/// <reference path='UpdateableElement.ts'/>

class CePlayerList extends UpdateableElement {
    private players: Array<any> = [];

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();

        this.applyStyle();

        // if we are room owner

        if (GAME.ownerUid == userdata.uid || !GAME.online) this.initDragDrop();

        this.update();
    }

    initDragDrop() {
        let dragged;

        document.addEventListener("dragstart", ev => {
            // store a ref. on the dragged elem
            dragged = ev.target;
            // make it half transparent
            (<HTMLElement>ev.target).style.opacity = "0.5";
        }, false);

        document.addEventListener("dragover", ev => {
            // prevent default to allow drop
            ev.preventDefault();
        }, false);

        document.addEventListener('dragenter', ev => {

        }, false)

        document.addEventListener("dragend", ev => {
            // reset the transparency
            (<HTMLElement>ev.target).style.opacity = "";
        }, false);

        document.addEventListener('drop', ev => {
            ev.preventDefault();

            if (GAME.ownerUid == userdata.uid) {
                let target = checkAllParents((<HTMLElement>ev.target));

                let targetParent: HTMLElement;

                // Needs to bubble up
                function checkAllParents(target): Element | false {
                    if (target == document.body) return false;
                    if (target.classList.contains('dd-item')) {
                        return target;
                    }

                    return checkAllParents(target.parentElement);
                }

                if (target) {
                    targetParent = target.parentElement;

                    // if dragged is after target

                    let cl = Array.from(targetParent.children);

                    if (cl.indexOf(dragged) > cl.indexOf(target)) {
                        targetParent.insertBefore(dragged, target)
                    } else {
                        targetParent.insertBefore(dragged, target.nextElementSibling)
                    }
                }

                let orderedPlayerList = [];
                for (let player of targetParent.children) {
                    if (player.tagName == "CE-PLAYER") orderedPlayerList.push((<CePlayer>player).uid);
                }

                if (GAME.online) {
                    console.log(orderedPlayerList)
                    // update player order on firebase
                    firestore.collection('rooms').doc(GAME.roomId).update({ playerOrder: orderedPlayerList });
                } else {
                    GAME.playerOrder = orderedPlayerList;
                }
            }
        }, false)

    }

    applyStyle() {
    }

    update() {
        super.update();

        // Update data
        let players = GAME.players;

        this.players = [];

        for (let p in players) {
            // sort into this.players in position of turnorder array
            players[p].uid = p;

            if (GAME.playerOrder.length == Object.keys(GAME.players).length) {// JS casting doing bits here ugh
                const pIdx = GAME.playerOrder.indexOf(p);
                pIdx != -1 ? this.players[pIdx] = players[p] : this.players.push(players[p])
            } else {
                this.players.push(players[p]);
            }
        }

        // Clear DOM
        Array.from(this.childNodes).forEach(el => this.removeChild(el));

        // Update DOM
        this.players.forEach(p => {
            let pElement = document.createElement('ce-player') as CePlayer;
            this.appendChild(pElement);
            pElement.player = p;
        });

        let addLocalPlayer = new CeCreatePlayerButton(document.querySelector('ce-create-player-menu'));
        this.appendChild(addLocalPlayer);
    }
}

customElements.define('ce-player-list', CePlayerList);