let cnv = document.createElement('canvas');
let ctx = cnv.getContext('2d');

let glass = document.querySelector('#glass') as HTMLElement;

glass.style.width = '80%';
glass.style.height = '50%';
glass.style.clipPath = 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)';
glass.style.backgroundColor = '#c0c0c06e';
glass.style.left = '10%';
glass.style.top = '25%';
glass.style.position = 'absolute';


const glassBB = glass.getBoundingClientRect();

cnv.width = glassBB.width;
cnv.height = glassBB.height;

glass.appendChild(cnv);

let currentProgress = 0;
let newProgress = 50;
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
        currentProgress++;
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

    requestAnimationFrame(drawLoop);
}

requestAnimationFrame(drawLoop);