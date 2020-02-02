export default function getProps(obj,keysToRemove?:Array<string>|string) {
    let newObj = {};
    for (let prop of Object.keys(obj)) {
        if (keysToRemove && keysToRemove.indexOf(prop) == -1 || !keysToRemove) newObj[prop] = obj[prop];
    }

    return newObj;
}
