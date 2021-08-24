import CustomElement from "./CustomElement.js";

export default class CeShowButton extends CustomElement {
    openState = false;
    target;
    icon;

    constructor(target?) {
        super();
        this.target = target;
    }

    async connectedCallback() {
        await super.connectedCallback();

        this.icon = this.shadowRoot.querySelector('#icon');

        console.log(this.icon,this);

        this.addEventListener('click', this.clicked.bind(this));

        this.applyStyle();
    }

    set img(src) {
        this.HTMLReady.then(()=>{
            (<HTMLImageElement>this.shadowRoot.querySelector('#icon')).src=src;
        })
    }
    
    async clicked() {
        if (!this.target.openState) {
            this.target.show();
        }
    }
}