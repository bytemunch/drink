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

    moveToTopRight() {
        // TODO put this in a class
        this.style.left = `calc(${document.body.style.marginLeft} + ${ document.body.style.width} - (${this.style.width}))`;
        this.style.top = `calc(5vh - ${this.style.height} / 2)`;
        this.style.position = `fixed`;
        this.style.zIndex = '11';
        return 'unset';
    }

    async connectedCallback() {
        await super.connectedCallback();

        this.classList.add('modalToggle');

        this.icon = document.createElement('img');
        this.icon.setAttribute('src', this.openImg);
        this.icon.classList.add('icon');
        this.shadowRoot.appendChild(this.icon);

        this.addEventListener('click', this.clicked.bind(this));

        this.applyStyle();
    }

    async clicked() {
        console.log('cliky',this)
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