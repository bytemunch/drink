import CustomElement from "./CustomElement.js";

export default class CeActionSelectDiv extends CustomElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Type, trigger, target
        let types = [
            ["Type","nopopup"],
            ["Target","target"],
            ["IRL","irl"],
        ]
        let typeSelect = document.createElement('select');
        for (let o of types) {
            let option = document.createElement('option');
            option.text = o[0];
            option.value = o[1];
            typeSelect.add(option)
        }

        let triggers = [
            ["Trigger","nopopup"],
            ["Immediate","immediate"],
            ["Player","player"],
        ]
        let triggerSelect = document.createElement('select');
        for (let o of triggers) {
            let option = document.createElement('option');
            option.text = o[0];
            option.value = o[1];
            triggerSelect.add(option)
        }

        let targets = [
            ["Target","nopopup"],
            ["Current Player","self"],
            ["Player Choice","choose"],
            ["Players Vote","vote"],
            ["All Players","all"],
            ["Guys","guys"],
            ["Girls","girls"],
        ]
        let targetSelect = document.createElement('select');
        for (let o of targets) {
            let option = document.createElement('option');
            option.text = o[0];
            option.value = o[1];
            targetSelect.add(option)
        }

        typeSelect.classList.add('action-select');
        triggerSelect.classList.add('action-select');
        targetSelect.classList.add('action-select');

        typeSelect.id = 'type-select';
        triggerSelect.id = 'trigger-select';
        targetSelect.id = 'target-select';

        this.shadowRoot.appendChild(typeSelect);
        this.shadowRoot.appendChild(triggerSelect);
        this.shadowRoot.appendChild(targetSelect);

        this.style.display = 'flex';
        this.style.width = '100%';
    }
}