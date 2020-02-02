import CustomElement from "./CustomElement.js";

export default class CeShowButton extends CustomElement {
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
        this.classList.add('show-button');
        // this.style.backgroundColor = palette.blue;
        // this.style.width = '32px';
        // this.style.height = '32px';
        // this.style.display = 'block';
        // this.style.position = 'absolute';
        // this.style.right = '1vw';
        // this.style.top = '1vw';
        // this.style.zIndex = '9';

        // this.style.left = 'unset';
    }

    moveToTopRight() {
        this.style.left = `calc(${document.body.style.marginLeft} + ${ document.body.style.width} - (${this.style.width}))`;
        this.style.top = `calc(5vh - ${this.style.height} / 2)`;
        this.style.position = `fixed`;
        this.style.zIndex = '11';
        return 'unset';
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

        if (!this.target.openState) {
            this.target.show();
        }
    }
}

// customElements.define('ce-show-button', CeShowButton);