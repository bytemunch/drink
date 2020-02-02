import CeCreatePlayerButton from "./CeCreatePlayerButton.js";

export default class CeInviteButton extends CeCreatePlayerButton {
    constructor(modal) {
        super(modal);
        this.openImg = './img/invite.svg';

    }

    applyStyle() {
        super.applyStyle();
        this.style.right = 'unset';
        this.style.top = 'unset'
    }

    connectedCallback() {
        super.connectedCallback();

        this.classList.add('small');
    }
}

// customElements.define('ce-invite-button', CeInviteButton);