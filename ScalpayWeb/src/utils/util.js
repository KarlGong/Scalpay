
export function toString(o) {
    if (typeof o === "string") {
        return o;
    }
    return JSON.stringify(o, null, 2);
}