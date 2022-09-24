const keysDown = new Map<string, boolean>();

window.addEventListener("keydown", e => {
    keysDown.set(e.key, true);
});

window.addEventListener("keyup", e => {
    keysDown.set(e.key, false);
});

export function keycombo(...keys: string[]) {
    return keys.reduce((prev, curr) => prev && keysDown.get(curr), true);
}