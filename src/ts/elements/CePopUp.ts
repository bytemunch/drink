import CustomElement from './CustomElement.js';

import { palette} from '../index.js';

export default class CePopUp extends CustomElement {
    titleP;
    messageP;
    ok;
    timer;
    innerDiv;
    callback;
    callbackArgs;
    titleTxt;
    messageTxt;

    // constructor(title, message,  timer = 0, type = 'info', callback?, callbackArgs?) {
    //     super();

    //     this.callback = callback;
    //     this.callbackArgs = callbackArgs || null;

    //     this.timer = timer;

    //     this.type = type;

    //     this.titleTxt = title;
    //     this.messageTxt = message;
    // }

    constructor(){super()}

    connectedCallback() {
        this.classList.add('popup');

        if (this.timer) {
            setTimeout(this.kill.bind(this), this.timer);
        }
        this.innerDiv = document.createElement('div');
        this.titleP = document.createElement('p');
        this.messageP = document.createElement('p');

        this.titleP.textContent = this.titleTxt;
        this.messageP.textContent = this.messageTxt;

        this.ok = document.createElement('button');
        this.ok.classList.add('small');
        
        this.ok.addEventListener('click', e=>{
            this.kill();
        })

        this.ok.textContent = 'OK';
        this.innerDiv.appendChild(this.titleP);
        this.innerDiv.appendChild(this.messageP);
        this.innerDiv.appendChild(this.ok);
        this.appendChild(this.innerDiv);

    }

    kill() {
        // animate then
        if (this.callback) this.callback(this.callbackArgs);
        this.parentElement.removeChild(this);
    }

    set type(type) {
        switch (type) {
            case 'error':
                // red
                this.innerDiv.style.backgroundColor = palette.red;
                break;
            case 'warning':
                this.innerDiv.style.backgroundColor = palette.green;
                break;
            case 'info':
            default:
                this.innerDiv.style.backgroundColor = palette.darkblue;
                break;
        }
    }
}