import CustomElement from "./CustomElement.js";
import CeRuleCreateMenu from "./CeRuleCreateMenu.js";
import CeShowButton from "./CeShowButton.js";
import CeRuleSelect from "./CeRuleSelect.js";

export default class CeRuleSelectDiv extends CustomElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.shadowRoot.appendChild(new CeRuleSelect);

        let ruleCreateMenu = new CeRuleCreateMenu;

        this.shadowRoot.appendChild(ruleCreateMenu);

        let showCardMenu = new CeShowButton(ruleCreateMenu);

        showCardMenu.openImg = './img/add.svg'

        this.shadowRoot.appendChild(showCardMenu);

        this.applyStyle();
    }
}