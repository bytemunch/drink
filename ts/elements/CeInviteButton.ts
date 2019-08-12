/// <reference path='CeCreatePlayerButton.ts'/>

class CeInviteButton extends CeCreatePlayerButton {
    constructor(modal) {
        super(modal);
        this.openImg = './img/invite.svg';

    }

    applyStyle() {
        super.applyStyle();
        this.style.right = 'unset';
        this.style.top = 'unset'
    }

    clicked() {
        super.clicked();
        this.style.right = this.openState ? '1vw' : 'unset';
        this.style.top = this.openState ? '1vw' : 'unset';
    }

    connectedCallback() {
        super.connectedCallback();

        this.classList.add('small');
    }
}

customElements.define('ce-invite-button', CeInviteButton);