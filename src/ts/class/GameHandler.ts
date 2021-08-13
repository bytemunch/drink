import RingOfFire from "./RingOfFire.js";
import RedOrBlack from "./RedOrBlack.js";

export default class GameHandler {
    gameObject:RedOrBlack|RingOfFire;
    online;

    updater = [];

    constructor() {
        this.online = false;
    }

    set type(type) {
        console.log('setting game type to '+type)
        switch (type) {
            case 'ring-of-fire':
                this.gameObject = new RingOfFire(this.online);
                break;
            case 'red-or-black':
                this.gameObject = new RedOrBlack(this.online);
                break;
        }
    }

    update() {
        for (let f of this.updater) {
            f();
        }
    }
}