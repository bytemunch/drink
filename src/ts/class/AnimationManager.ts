class AnimationManager {
    duration: number;
    start: number;
    animationName: string;
    animations: any;
    progress; // 0 < X > 1

    constructor() {
        this.animations = {
            flip90: function flip90(args) {
                let currentDeg = args.progress * 95;
                this.style.transform = `perspective(600px) rotateY(${currentDeg > 90 ? 90 : currentDeg}deg)`
            },
            flipBack90: function flipBack90(args) {
                let currentDeg = 90 + (args.progress * 95);
                this.style.transform = `perspective(600px) rotateY(${currentDeg > 180 ? 180 : currentDeg}deg) scaleX(-1)`
            },
            turnCard: function turnCard(args) {
                let currentDeg = args.progress < 0.5 ? args.progress * 90 : args.progress * 180;

                if (args.progress < 0.5) {
                    currentDeg = args.progress*2 * 90;
                    this.style.transform = `perspective(600px) rotateY(${currentDeg > 90 ? 90 : currentDeg}deg)`
                } else {
                    // change pic
                    this.setAttribute('src',args.newSrc);
                    currentDeg = (args.progress*2 * 90);
                    this.style.transform = `perspective(600px) rotateY(${currentDeg > 180 ? 180 : currentDeg}deg) scaleX(-1)`

                }
            },
            flyRight: function flyRight(args) {
                const bb = args.startBB;
                let currentX = ((window.innerWidth - bb.left) * args.progress);
                this.style.transform = `translateX(${currentX}px)`;
                this.style.opacity = 1 - args.progress * 1.1;
            },
            fadeOut: function fadeOut(args) {
                this.style.opacity = 1 - args.progress * 1.1;
            },
            fadeIn: function fadeIn(args) {
                this.style.opacity = args.progress;
            },
            wait: function wait(args) {
                // literally a wait function to stay as is for a tick
            },
            playerListGrow: function (args) {
                this.style.width = `calc(${(args.progress * 25)}vw + 24px)`
            },
            playerListShrink: function (args) {
                this.style.width = `calc(25vw - ${(args.progress * 25)}vw + 24px)`
            },
            translate: function (args) {
                this.style.transform = `translate(${args.x * args.progress}px, ${args.y * args.progress}px)`;
            },
            translateTo: function (args) {
                if (!args.startTranslate) {
                    let style = getComputedStyle(this);
                    // TODO cross browser here t
                    let matrix = new DOMMatrix(style.transform);

                    let x = matrix.m41;
                    let y = matrix.m42;

                    args.startTranslate = { x, y };
                }

                if (!args.startBB) args.startBB = this.getBoundingClientRect();

                let deltaX = args.x - args.startBB.x;
                let deltaY = args.y - args.startBB.y;

                let currentX = (args.startTranslate.x + (deltaX * args.progress));
                let currentY = (args.startTranslate.y + (deltaY * args.progress));

                this.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }
    }

    animate(animationTarget, animation, duration, easing?:string, args?) {

        if (!args) args = {};

        args.start = performance.now();
        args.duration = duration;

        // min one full frame snap to end of animation
        const graceFrames = 1;
        const frameTime = (1000 / 60);
        let graceAmount = 1 - ((frameTime / duration) * graceFrames);


        let easings = {
            'easeInOutQuad':(t) => {
                return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
            },
            'linear':(t)=>{return t},

        }

        return new Promise((resolve) => {
            let rAFcb = function (timestamp) {
                if (timestamp < args.start + args.duration) {
                    // set vars

                    let t = (timestamp - args.start) / args.duration;
                    args.progress = easing ? easings[easing](t) : t;

                    if (args.progress > graceAmount) args.progress = 1;

                    // run chosen animation bound to the object implementing
                    // this animations object
                    this.animations[animation].bind(animationTarget)(args);

                    requestAnimationFrame(rAFcb.bind(this))
                } else {
                    resolve();
                }
            }

            requestAnimationFrame(rAFcb.bind(this));

        })
    }
}