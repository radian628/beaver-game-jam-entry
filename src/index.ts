import { getAllKeysDown, getMousePos, keycombo, rightMouseDown, setRightMouseDown, viewBottom, viewTopLeft } from "./controls.mjs";
import { getimg } from "./draw.mjs";
import { createDefaultEnemy, updateEnemies } from "./enemy_logic.mjs";
import { enemyTextures, GameState, Screen, towerTextures } from "./game_state.mjs";
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

function drawOutlinedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
}


async function gameLoop() {
    if (rightMouseDown && getAllKeysDown().length != 0) {
        setRightMouseDown(false);
        const mousepos = getMousePos();
        game.towers.push(createDefaultTower(mousepos.x, mousepos.y, getAllKeysDown()));
    }


    if (!ctx) {
        window.alert("Failed to create canvas context.");
        throw new Error("stupid canvas isnt working");
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const sf = window.innerHeight / (viewBottom - viewTopLeft.y);
    ctx.scale(sf, sf);
    ctx.translate(-viewTopLeft.x, -viewTopLeft.y);

    ctx.font = "48px TexGyreAdventor";

    ctx.fillStyle = "red";
    game.towerProjectiles.forEach(t => {
        ctx.fillRect(t.x - 2, t.y - 2, 4, 4);
    });
    game.enemyProjectiles.forEach(t => {
        ctx.fillRect(t.x - 2, t.y - 2, 4, 4);
    });
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
    for (let t of game.enemies) {
        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.drawImage(await getimg(enemyTextures[t.type]), -25, -25, 50, 50);
        ctx.restore();
    }



    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.lineWidth = 10;
    ctx.font = "48px TexGyreAdventor";
    drawOutlinedText(ctx, "$" + game.money, 10, 50);

    updateTowers(game);
    updateEnemies(game);
    updateProjectiles(game);
    requestAnimationFrame(gameLoop);
}

gameLoop();
