function shrinkImage(img, max_height = 64, max_width = 64) {
    if (!img) return false;
    let canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.style.position = 'absolute';
    canvas.style.top='0';
    canvas.style.left='128px';
    canvas.style.display = 'none';
    let ctx = canvas.getContext('2d');

    let width = img.width;
    let height = img.height;

    if (width < max_width) max_width = width;
    if (height < max_height) max_height = height;

    let xOff = 0;
    let yOff = 0;

    if (width > height) {
        if (width > max_width) {
            width *= max_height / height;
            height *= max_height / height;
        }
        xOff = -(width-height)/2;
    } else {
        if (height > max_height) {
            height *= max_width / width;
            width *= max_width / width;
        }
        yOff = -(height-width)/2;
    }

    canvas.width = max_width;
    canvas.height = max_height;

    ctx.drawImage(img, xOff, yOff, width, height); // Center?

    return canvas.toDataURL('image/png');
}
