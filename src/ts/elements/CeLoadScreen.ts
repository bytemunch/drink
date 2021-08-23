import CustomElement from './CustomElement.js';

interface ICeLoadElements {
    title: HTMLElement,
    flavor: HTMLElement,
}

export default class CeLoadScreen extends CustomElement {
    elements: ICeLoadElements = {
        title: document.createElement('h2'),
        flavor: document.createElement('h3')
    }
    timer;
    killTrigger: string;

    constructor(killTrigger) {
        super();
        this.killTrigger = killTrigger;
    }

    dots() {
        let currentText = this.elements.title.textContent;
        let matches = currentText.match(/[\.]/g);

        if (matches && matches.length >= 3) {
            currentText = currentText.replace(/[\.]/g, '');
        } else {
            currentText = currentText + '.';
        }
        this.elements.title.textContent = currentText;
    }

    kill() {
        clearInterval(this.timer);
        this.parentElement.removeChild(this);
    }

    pickLoadMessage(messages: Array<string>) {
        let rNum = Math.floor(Math.random() * messages.length);
        this.elements.flavor.textContent = messages[rNum];
    }

    async connectedCallback() {
        await super.connectedCallback();

        this.applyStyle();

        this.elements.title.textContent = 'loading';
        this.shadowRoot.appendChild(this.elements.title);

        this.elements.flavor.textContent = 'won\'t be long...';
        this.shadowRoot.appendChild(this.elements.flavor);

        this.timer = setInterval(this.dots.bind(this), 500);

        // Add canvas for loading animation
        this.addCanvas();
    }

    addCanvas() {
        let cnv = document.createElement('canvas');
        let ctx = cnv.getContext('2d');

        let glass = document.createElement('div');

        glass.id = 'glass';

        this.shadowRoot.appendChild(glass);

        const glassBB = glass.getBoundingClientRect();

        cnv.width = glassBB.width;
        cnv.height = glassBB.height;

        glass.appendChild(cnv);

        let currentProgress = 0;
        let newProgress = 100;
        let frameCount = 0;

        const height = cnv.height;
        const width = cnv.width;

        let bubbles = [];

        class Bubble {
            x;
            y;
            size;
            popHeight;

            constructor(popHeight) {
                this.x = Math.random() * width;
                this.y = height;
                this.size = Math.random() * 5;
                this.popHeight = popHeight;
            }

            update(popHeight) {
                this.popHeight = popHeight;

                let wobble = -3 + Math.random() * 6;
                this.y -= Math.random() * 4;
                this.x += wobble;

                if (this.y < this.popHeight) {
                    bubbles.splice(bubbles.indexOf(this), 1);
                }
            }

            draw() {
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.beginPath();
                ctx.ellipse(this.x, this.y, this.size, this.size, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const drawLoop = ts => {
            frameCount++;

            ctx.clearRect(0, 0, width, height);

            if (currentProgress < newProgress) {
                currentProgress += 2;
            }

            const fillLevel = height - (height * (currentProgress / 110));
            // add bubble
            bubbles.push(new Bubble(fillLevel));

            // Wobble liquid
            const wobbleRate = 100;
            let flipFlop = frameCount % wobbleRate;

            if (flipFlop > (wobbleRate * 0.75)) {
                flipFlop = -((wobbleRate * 0.25) - (flipFlop - wobbleRate * 0.75))
            } else if (flipFlop > (wobbleRate * 0.5)) {
                flipFlop = -flipFlop + (wobbleRate * 0.5);
            } else if (flipFlop > (wobbleRate * 0.25)) {
                flipFlop = (wobbleRate * 0.25) - (flipFlop - (wobbleRate * 0.25));
            }

            ctx.fillStyle = 'rgba(255, 179, 93, 0.75)';
            ctx.strokeStyle = 'rgba(255, 179, 93, 0.75)';
            ctx.beginPath();
            ctx.moveTo(0, fillLevel);
            ctx.bezierCurveTo(width * 0.25, fillLevel + flipFlop, width * 0.75, fillLevel - flipFlop, width, fillLevel);
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.stroke();
            ctx.fill();

            // draw bubbles
            for (let b of bubbles) {
                b.update(fillLevel);
                b.draw();
            }

            if (document.querySelector('ce-load-screen')) requestAnimationFrame(drawLoop);

        }

        requestAnimationFrame(drawLoop);
    }

}