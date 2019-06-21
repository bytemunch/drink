async function easyPOST(fn: string, data: any) {
    return fetch(`https://us-central1-ring-of-fire-5d1a4.cloudfunctions.net/${fn}`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data)
    });
}
