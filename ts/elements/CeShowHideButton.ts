/// <reference path='CustomElement.ts'/>

class CeShowHideButton extends CustomElement {
    openState = false;
    openImg;
    closeImg;
    target;
    icon;

    constructor(target) {
        super();
        this.target = target;
        this.openImg = './img/menu-icon.svg';
        this.closeImg = './img/close-icon.svg';
    }

    applyStyle() {
        this.style.backgroundColor = palette.blue;
        this.style.width = '32px';
        this.style.height = '32px';
        this.style.display = 'block';
        this.style.position = 'absolute';
        this.style.right = '1vw';
        this.style.top = '1vw';

        this.style.zIndex = '11';
    }

    connectedCallback() {
        super.connectedCallback();

        this.classList.add('modalToggle');

        this.icon = document.createElement('img');
        this.icon.setAttribute('src', this.openImg);
        this.icon.classList.add('icon');
        this.appendChild(this.icon);

        this.addEventListener('click', this.clicked);

        this.applyStyle();
    }

    clicked() {
        // close other modals

        const otherButtons = document.querySelectorAll('.modalToggle') as any;

        for (let b of otherButtons) {
            if (b.openState && b !== this) {
                b.click();
            }
        }

        this.openState = !this.openState;


        if (this.openState) {
            this.target.show();
            this.style.backgroundColor = palette.red;
            this.icon.setAttribute('src', this.closeImg);

        } else {
            this.target.hide();
            this.style.backgroundColor = palette.blue;
            this.icon.setAttribute('src', this.openImg);
        }
    }

}

customElements.define('ce-show-hide-button', CeShowHideButton);