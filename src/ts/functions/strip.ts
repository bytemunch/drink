// Returns object with no non enumerable properties
export default function strip(object) {
    return JSON.parse(JSON.stringify(object));
}