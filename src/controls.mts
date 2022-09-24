const keysDown = new Map<string, boolean>();
const singleKeysDown = new Map<string, boolean>();
let mousePos = { x: 0, y: 0 }

window.addEventListener("keydown", e => {
    keysDown.set(e.key, true);
    singleKeysDown.set(e.key, true);
});

window.addEventListener("keyup", e => {
    keysDown.set(e.key, false);
    singleKeysDown.set(e.key, false);
});

window.addEventListener("mousemove", e => {
    mousePos = {
        x: e.clientX,
        y: e.clientY
    };
})

export function keycombo(...keys: string[]) {
    return keys.reduce((prev, curr) => prev && (keysDown.get(curr) ?? false), true);
}

export function getMousePos(): { x: number, y: number } {
    return { ...mousePos };
}