export default function dataURItoFile(data,filename=Date.now().toString()) {
    const byteString = atob(data.split(',')[1]);

    const mimeType = data.split(',')[0].split(':')[1].split(';')[0];

    let buffer = new ArrayBuffer(byteString.length);

    let intArray = new Uint8Array(buffer);

    for (let i=0;i<byteString.length;i++) {
        intArray[i] = byteString.charCodeAt(i);
    }

    return new File([buffer],filename,{type:mimeType});
}