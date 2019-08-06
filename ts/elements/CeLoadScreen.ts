/// <reference path='CustomElement.ts'/>
interface ICeLoadElements {
    title: HTMLElement,
    flavor: HTMLElement,
}

class CeLoadScreen extends CustomElement {
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

    applyStyle() {
        this.style.width = '100vw';
        this.style.height = '100vh';
        this.style.position = 'absolute';
        this.style.backgroundColor = 'rgb(76, 123, 224)';
        this.style.backgroundImage = '-webkit-linear-gradient(top,rgb(76, 123, 224)  0%, rgb(115, 133, 212) 51%)';
        this.style.display = 'block';
        this.style.top = '0';
        this.style.left = '0';
        this.style.zIndex = '100';
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

    connectedCallback() {
        super.connectedCallback();

        this.applyStyle();

        this.elements.title.textContent = 'loading';
        this.appendChild(this.elements.title);

        this.elements.flavor.textContent = 'won\'t be long...';
        this.appendChild(this.elements.flavor);

        this.timer = setInterval(this.dots.bind(this), 500);

        // Add canvas for loading animation
        this.addCanvas();
    }

    addCanvas() {
        let cnv = document.createElement('canvas');
        let ctx = cnv.getContext('2d');

        let glass = document.createElement('div');

        glass.style.width = '80vw';
        glass.style.height = '50vh';
        glass.style.clipPath = 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)';
        glass.style.backgroundColor = '#c0c0c06e';
        glass.style.left = '10vw';
        glass.style.top = '25vh';
        glass.style.position = 'absolute';

        this.appendChild(glass);

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

            // console.log(currentProgress, newProgress)

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

customElements.define('ce-load-screen', CeLoadScreen);