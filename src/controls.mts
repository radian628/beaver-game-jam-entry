const keysDown = new Map<string, boolean>();
const keysDownIndex = new Map<string, number>();
let mousePos = { x: 0, y: 0 }
let mousePosScreen = { x: 0, y: 0 }

export let mouseDown = false;
export let rightMouseDown = false; 
export let setRightMouseDown = (v: boolean) => rightMouseDown = v;

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
    if (e.button == 0) mouseDown = true;
    if (e.button == 2) rightMouseDown = true; 
});

document.addEventListener("mouseup", e => {
    if (e.button == 0) mouseDown = false;
    if (e.button == 2) rightMouseDown = false;
});

document.addEventListener("contextmenu", e => {
    e.preventDefault();
    return false;
});

window.addEventListener("mousemove", e => {
    const factor = (viewBottom - viewTopLeft.y) / window.innerHeight;
    // if (mouseDown) {
    //     viewTopLeft.x -= e.movementX * factor;
    //     viewTopLeft.y -= e.movementY * factor;
    //     viewBottom -= e.movementY * factor;
    // }
    mousePos = {
        x: e.clientX * factor + viewTopLeft.x,
        y: e.clientY * factor + viewTopLeft.y
    };
    mousePosScreen = {
        x: e.clientX,
        y: e.clientY
    };
});

function controlLoop() {
    let movementX = 0;
    let movementY = 0;
    
    let xpercent = mousePosScreen.x / window.innerWidth * 100;
    let ypercent = mousePosScreen.y / window.innerHeight * 100;
    if (xpercent > 70) movementX = -Math.min(40, 1 / (1 - xpercent * 0.01));
    if (xpercent < 30) movementX = Math.min(40, 1 / (xpercent * 0.01));
    if (ypercent > 70) movementY = -Math.min(40, 1 / (1 - ypercent * 0.01));
    if (ypercent < 30) movementY = Math.min(40, 1 / (ypercent * 0.01));;

    const factor = (viewBottom - viewTopLeft.y) / window.innerHeight;
    //if (mouseDown) {
        viewTopLeft.x -= movementX * factor;
        viewTopLeft.y -= movementY * factor;
        viewBottom -= movementY * factor;
    //}
    requestAnimationFrame(controlLoop);
}
controlLoop();

window.addEventListener("wheel", e => {
    const amount = Math.sign(e.deltaY);
    const factor = amount * 0.05 + 1;

    const centerY = (viewTopLeft.y + viewBottom) / 2;
    const centerX = viewTopLeft.x + (centerY - viewTopLeft.y) * window.innerWidth / window.innerHeight;

    viewTopLeft.x = centerX + factor * (viewTopLeft.x - centerX);
    viewTopLeft.y = centerY + factor * (viewTopLeft.y - centerY);
    viewBottom = centerY + factor * (viewBottom - centerY);
    console.log(viewTopLeft, viewBottom);
});

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