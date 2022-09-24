const keysDown = new Map<string, boolean>();
const keysDownIndex = new Map<string, number>();
let mousePos = { x: 0, y: 0 }

let mouseDown = false;

export let viewTopLeft = { x: 0, y: 0 }
export let viewBottom = 600;

window.addEventListener("keydown", e => {
    if (!keysDown.get(e.key.toUpperCase())) {
        keysDownIndex.set(e.key.toUpperCase(), keysDownIndex.has(e.key.toUpperCase()) ? (keysDownIndex.get(e.key.toUpperCase()) as number + 1) : 0);
        console.log(keysDownIndex.get(e.key.toUpperCase()));
    }
    keysDown.set(e.key.toUpperCase(), true);
});

window.addEventListener("keyup", e => {
    keysDown.set(e.key.toUpperCase(), false);
});

document.addEventListener("mousedown", e => {
    mouseDown = true;
});

document.addEventListener("mouseup", e => {
    mouseDown = false;
});

window.addEventListener("mousemove", e => {
    const factor = (viewBottom - viewTopLeft.y) / window.innerHeight;
    if (mouseDown) {
        viewTopLeft.x -= e.movementX * factor;
        viewTopLeft.y -= e.movementY * factor;
        viewBottom -= e.movementY * factor;
    }
    mousePos = {
        x: e.clientX,
        y: e.clientY
    };
})

export function keycombo(...keys: string[]) {
    return keys.reduce((prev, curr) => prev && (keysDown.get(curr) ?? false), true);
}

export function keycomboindex(keys: string[], indices: number[]) {
    for (let i = 0; i < keys.length; i++) {
        if (!keysDown.get(keys[i])) return false;
        if (keysDownIndex.get(keys[i]) == indices[i]) return false;
        indices[i] = keysDownIndex.get(keys[i]) ?? -1;
    }
    return true;
}

export function getMousePos(): { x: number, y: number } {
    return { ...mousePos };
}