import CustomElement from "./CustomElement.js";

export default class CeShowButton extends CustomElement {
    openState = false;
    openImg;
    closeImg;
    target;
    icon;
    baAnimate;

    constructor(target) {
        super();
        this.target = target;
        this.openImg = './img/menu-icon.svg';
        this.closeImg = './img/close-icon.svg';
    }

    applyStyle() {

        // add stylesheet explicitly for extensions
        // TODO find a more elegant solution, maybe always inherit styles?
        let sharedStylesheet = document.createElement('link');
        sharedStylesheet.href = `./styles/CeShowButton.css`;
        sharedStylesheet.rel = "stylesheet";
        this.shadowRoot.appendChild(sharedStylesheet);

        super.applyStyle();

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
        this.shadowRoot.appendChild(this.icon);

        this.addEventListener('click', e=>this.clicked(e));

        this.applyStyle();
    }

    async clicked(e:MouseEvent) {
        // close other modals
        
        // comment out while shadowroot sorted
        // await this.baAnimate(e);

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