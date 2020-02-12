export default function disablePage() {
    (<HTMLElement>document.querySelector('.page')).style.pointerEvents = 'none';
}