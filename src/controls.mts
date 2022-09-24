const keysDown = new Map<string, boolean>();
const keysDownIndex = new Map<string, number>();
let mousePos = { x: 0, y: 0 }

window.addEventListener("keydown", e => {
    if (!keysDown.get(e.key)) {
        keysDownIndex.set(e.key, keysDownIndex.has(e.key) ? (keysDownIndex.get(e.key) as number + 1) : 0);
        console.log(keysDownIndex.get(e.key));
    }
    keysDown.set(e.key, true);
});

window.addEventListener("keyup", e => {
    keysDown.set(e.key, false);
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