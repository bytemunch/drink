import CustomElement from './CustomElement.js';

import { palette} from '../index.js';
import { addAnimate } from '../functions/buttonAnimator.js';

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

    constructor(){super()}

    async connectedCallback() {
        await super.connectedCallback();

        this.classList.add('popup');

        if (this.timer) {
            setTimeout(this.kill.bind(this), this.timer);
        }

        this.titleP = this.shadowRoot.querySelector('.title');
        this.messageP = this.shadowRoot.querySelector('.message');

        this.titleP.textContent = this.titleTxt;
        this.messageP.textContent = this.messageTxt;

        this.ok = this.shadowRoot.querySelector('button');
        this.ok.classList.add('small');
        
        this.ok.addEventListener('click', async (e) => {
            this.kill();
        })

        this.applyStyle();

        (<HTMLButtonElement>this.ok).disabled = false;
    }

    show() {
        this.animate([
            {opacity: 0},
            {opacity: 1}
        ], {
            duration: 100,
            easing: 'ease-out'
        })
    }

    async kill() {
        // animate then
        this.animate([
            {opacity: 1},
            {opacity: 0}
        ], {
            duration: 100,
            easing: 'ease-out'
        }).onfinish = () => {
            if (this.callback) this.callback(this.callbackArgs);
            this.parentElement.removeChild(this);
        }
    }

    set type(type) {
        this.innerDiv.classList.add(type);
    }
}