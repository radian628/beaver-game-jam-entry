import { getMousePos, keycombo, viewBottom, viewTopLeft } from "./controls.mjs";
import { getimg } from "./draw.mjs";
import { createDefaultEnemy, updateEnemies } from "./enemy_logic.mjs";
import { GameState, Screen, towerTextures } from "./game_state.mjs";
import { updateProjectiles } from "./projectile_logic.mjs";
import { createDefaultTower, getAngleToMouse, updateTowers } from "./tower_logic.mjs";

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", onResize);
window.dispatchEvent(new Event("resize"));
const ctx = canvas.getContext("2d");


console.log("got here!");   

let game: GameState = {
    towers: [],
    enemies: [],
    towerProjectiles: [],
    enemyProjectiles: [],
    money: 0,
    screen: Screen.GAME,
    home: { x: 0, y: 0, hp: 1000, maxHP: 1000 }
}

game.towers.push(
    createDefaultTower(40, 50, ["A"]),
    createDefaultTower(400, 50, ["B"]),
    createDefaultTower(40, 500, ["C"]),
)

game.enemies.push(
    createDefaultEnemy(300, 300),
)

async function gameLoop() {
    if (!ctx) {
        window.alert("Failed to create canvas context.");
        throw new Error("stupid canvas isnt working");
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    
    const sf = window.innerHeight / (viewBottom - viewTopLeft.y);
    ctx.scale(sf, sf);
    ctx.translate(-viewTopLeft.x, -viewTopLeft.y);
    
    for (let t of game.towers) {
        ctx.save();
        ctx.drawImage(await getimg(towerTextures[t.type].base), t.x - 25, t.y - 25, 50, 50);
        ctx.translate(t.x, t.y);
        const mouseAngle = getAngleToMouse(t.x, t.y);
        ctx.rotate(mouseAngle);
        ctx.drawImage(await getimg(towerTextures[t.type].cannon), -50, -25, 100, 50);
        const mousePos = getMousePos();
        ctx.strokeStyle = `rgba(0, 0, 0, ${Math.min(1, 30 / Math.hypot(mousePos.x - t.x, mousePos.y - t.y))})`;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, 30 / Math.hypot(mousePos.x - t.x, mousePos.y - t.y))})`;
        ctx.font = "32px TexGyreAdventor";
        ctx.textAlign = "center";
        ctx.lineWidth = 5;
        ctx.rotate(-mouseAngle);
        ctx.strokeText(t.fireKeys.join("+"), 0,10);
        ctx.fillText(t.fireKeys.join("+"), 0, 10);
        ctx.restore();
    }
    ctx.fillStyle = "red";
    game.enemies.forEach(t => {
        ctx.fillRect(t.x - 5, t.y - 5, 10, 10);
    });
    game.towerProjectiles.forEach(t => {
        ctx.fillRect(t.x - 2, t.y - 2, 4, 4);
    });
    game.enemyProjectiles.forEach(t => {
        ctx.fillRect(t.x - 2, t.y - 2, 4, 4);
    });

    updateTowers(game);
    updateEnemies(game);
    updateProjectiles(game);
    requestAnimationFrame(gameLoop);
}

gameLoop();