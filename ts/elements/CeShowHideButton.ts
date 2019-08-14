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

        this.style.left = 'unset';
    }

    moveToTopRight() {
        this.style.left = `calc(${document.body.style.marginLeft} + (${ document.body.style.width} * 0.9) + (${this.style.width} / 2))`;
        this.style.top = `calc(5vh - ${this.style.height} / 2)`;
        this.style.position = `fixed`;
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
            this.moveToTopRight();
            this.target.show();
            this.style.backgroundColor = palette.red;
            this.icon.setAttribute('src', this.closeImg);

        } else {
            this.applyStyle();
            this.target.hide();
            this.style.backgroundColor = palette.blue;
            this.icon.setAttribute('src', this.openImg);
        }
    }

}

customElements.define('ce-show-hide-button', CeShowHideButton);