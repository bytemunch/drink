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
            flyRight: function flyRight(args) {
                const bb = args.startBB;
                let currentX = ((window.innerWidth - bb.left)*args.progress);
                this.style.transform = `translateX(${currentX}px)`;
                this.style.opacity = 1-args.progress*1.1;
            },
            fadeOut: function fadeOut(args) {
                this.style.opacity = 1 - args.progress*1.1;
            },
            fadeIn: function fadeIn(args) {
                this.style.opacity = args.progress;
            },
            wait: function wait(args) {
                // literally a wait function to stay as is for a tick
            },
            playerListGrow: function(args) {
                this.style.width = `calc(${(args.progress*25)}vw + 24px)`
            },
            playerListShrink: function(args) {
                this.style.width = `calc(25vw - ${(args.progress*25)}vw + 24px)`
                if (args.progress > 0.9) this.style.width = '24px'
            }
        }
    }

    animate(animationTarget,animation,duration,args?) {

        if (!args) args = {};

        args.start = performance.now();
        args.duration = duration;

        return new Promise((resolve) => {
            let rAFcb = function (t) {
                if (t < args.start + args.duration) {
                    // set vars
                    args.progress = (t - args.start) / args.duration;

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