class PromiseAnimations {
    duration: number;
    start: number;
    animationName: string;
    animations: any;
    progress; // 0 < X > 1

    constructor() {
        this.animations = {
            testAnim: function testAnim() {
                this.x += 1;
                this.y -= 2;
                console.log(this);
            },
            flip90: function flip90() {
                let currentDeg = this.animations.progress * 95;
                this.img.style.transform = `perspective(600px) rotateY(${currentDeg > 90 ? 90 : currentDeg}deg)`
            },
            flipBack90: function flipBack90() {
                let currentDeg = 90 + (this.animations.progress * 90);
                this.img.style.transform = `perspective(600px) rotateY(${currentDeg > 180 ? 180 : currentDeg}deg) scaleX(-1)`
            }
        }
    }

    animate(self,animation,duration,args={}) {

        this.start = performance.now();
        this.duration = duration;

        return new Promise((resolve) => {
            let rAFcb = function (t) {
                if (t < this.start + this.duration) {
                    // set vars
                    this.progress =  (t - this.start) / this.duration;
                    
                    // run chosen animation bound to the object implementing
                    // this animations object
                    this.animations[animation].bind(self)(args);

                    requestAnimationFrame(rAFcb.bind(this))
                } else {
                    resolve();
                }
            }

            requestAnimationFrame(rAFcb.bind(this));

        })
    }
}