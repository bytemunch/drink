const rgb2hex = (rgb: string) => '#' + rgb.replace(/[rgba\(\)\ ]/g, '').split(',').splice(0, 3).map(d => { const h = Number(d).toString(16); return h.length == 1 ? `0${h}` : h; }).join('');


export default rgb2hex;