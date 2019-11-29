function errorPopUp(msg,timer=0) {
    document.body.appendChild(new CePopUp('Error!', msg, timer, 'error'));
}