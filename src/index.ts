import { keycombo } from "./controls.mjs";

console.log("got here!");   

function loop() {
    if (keycombo("a", "b")) {
        console.log("keys a and b pressed");
    };
}

setInterval(loop, 30);