import { LOCAL_MODE } from "../index.js";

export default async function easyPOST(fn: string, data: any) {
    const url = LOCAL_MODE ? `http://localhost:5001/ring-of-fire-5d1a4/us-central1/` : `https://us-central1-ring-of-fire-5d1a4.cloudfunctions.net/`
    return fetch(url+fn, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data)
    });
}
