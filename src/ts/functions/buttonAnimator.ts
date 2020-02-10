function addCircleStyles() {
    let style = document.createElement('style');
    style.id='ex-circle-styles';
    style.innerHTML = `
    .ex-circle {
        pointer-events: none;
        position: absolute;
        width: 0;
        padding-top: 0;
        border-radius: 1000px;
        background-color: rgb(255,255,255);
        opacity: 0.2;
        transform: translate(-50%,-50%);
    }
    
    :root {
        --al: 320ms;
    }
    
    .ex-c-1 {
        animation: expand-circle var(--al) ease-out forwards, fade-out calc(var(--al)*0.6) linear var(--al) forwards;
    }
    
    .ex-c-2 {
        animation: expand-circle var(--al) ease-out 100ms forwards, fade-out calc(var(--al)*0.6) linear var(--al) forwards;
    }
    
    @keyframes expand-circle {
        from {
            width: 0;
            padding-top: 0;
        }
        to {
            width: 200%;
            padding-top: 200%;
        }
    }
    
    @keyframes fade-out {
        from {
            opacity: 0.2;
        }
        to {
            opacity: 0;
        }
    }`;
    document.head.appendChild(style);
}

export default function addExpandingCircles(e:MouseEvent) {

    if (!document.querySelector('#ex-circle-style')) {
        addCircleStyles();
    }

    const offset = (<HTMLElement>e.target).getBoundingClientRect();
    let mX = e.clientX - offset.left;
    let mY = e.clientY - offset.top;

    let exC_1 = document.createElement('div');
    exC_1.classList.add('ex-circle','ex-c-1');
    exC_1.style.left = mX.toString()+'px';
    exC_1.style.top = mY.toString()+'px';

    let exC_2 = document.createElement('div');
    exC_2.classList.add('ex-circle','ex-c-2');
    exC_2.style.left = mX.toString()+'px';
    exC_2.style.top = mY.toString()+'px';


    (<HTMLElement>e.target).appendChild(exC_1);
    (<HTMLElement>e.target).appendChild(exC_2);

    return new Promise(res=>setTimeout(()=>res(),330));
}