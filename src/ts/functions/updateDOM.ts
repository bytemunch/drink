function updateDOM() {
    const elements = document.querySelectorAll('.updateable-element');
    elements.forEach(element => {
        const castElement = element as UpdateableElement;
        castElement.update();
    });
}
