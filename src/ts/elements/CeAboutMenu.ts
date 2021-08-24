import CeMenu from "./CeMenu.js";

export default class CeAboutMenu extends CeMenu {
    constructor() {
        super();
    }

    async connectedCallback() {
        await super.connectedCallback();

        this.title = 'About';

        this.applyStyle();
    }
}