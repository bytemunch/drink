import CeCreatePlayerButton from "./CeCreatePlayerButton.js";

export default class CeInviteButton extends CeCreatePlayerButton {
    constructor(modal) {
        super(modal);
        this.openImg = './img/invite.svg';

    }

    connectedCallback() {
        super.connectedCallback();

        this.classList.add('small');
    }
}