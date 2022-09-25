import { getAllKeysDown, getMousePos, keycombo, rightMouseDown, setRightMouseDown, viewBottom, viewTopLeft } from "./controls.mjs";
import { getimg, drawTitle, drawGame } from "./draw.mjs";
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
    screen: Screen.TITLE,
    homes: [
        { x: 0, y: 0, hp: 1000, maxHP: 1000 },
        { x: 550, y: 550, hp: 1000, maxHP: 1000 }
    ]
}

game.towers.push(
    createDefaultTower(40, 50, ["A"]),
    createDefaultTower(400, 50, ["B"]),
    createDefaultTower(40, 500, ["C"]),
)

function arrayEq<T>(a: T[], b: T[]) {
    if (a.length != b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) return false;
    }
    return true;
}

function isRepeatKeybind(keys: string[]) {
    for (let t of game.towers) {
        if (arrayEq(t.fireKeys, keys)) return true;
    }
    return false;
}

async function gameLoop() {
    if (!ctx) {
        window.alert("canvas error that should nver evr happen");
        throw "";
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (game.screen == Screen.TITLE) {
        drawTitle(ctx, game);
    } else if (game.screen == Screen.GAME) {
        drawGame(ctx, game);
        if (Math.random() > 0.99) {
            game.enemies.push(
                createDefaultEnemy(Math.random() * 3000 - 1500, Math.random() * 3000 - 1500),
            )
        }
        if (rightMouseDown && getAllKeysDown().length != 0 && !isRepeatKeybind(getAllKeysDown())
        && getAllKeysDown().reduce((prev, curr) => prev && (curr.match(/^[0-9A-Z]$/g) !== null), true)
        ) {
            setRightMouseDown(false);
            const mousepos = getMousePos();
            game.towers.push(createDefaultTower(mousepos.x, mousepos.y, getAllKeysDown()));
        }
        updateTowers(game);
        updateEnemies(game);
        updateProjectiles(game);
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
