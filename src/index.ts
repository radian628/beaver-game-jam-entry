import { getAllKeysDown, getMousePos, keycombo, mousePosScreen, rightMouseDown, setRightMouseDown, viewBottom, viewTopLeft } from "./controls.mjs";
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
    resources: new Array(100).fill(0).map(() => {
        return {
            x: Math.random() * 10000 - 5000,
            y: Math.random() * 10000 - 5000,
            amount: Math.random() * 100 + 100
        }
    }),
    money: 60,
    totalMoney: 60,
    towerCost: 15,
    homeCost: 30,
    screen: Screen.GAME,
    homes: [
        { x: 0, y: 0, hp: 1000, maxHP: 1000 },
        { x: 550, y: 550, hp: 1000, maxHP: 1000 }
    ]
}

game.towers.push(
    // createDefaultTower(40, 50, ["A"]),
    // createDefaultTower(400, 50, ["B"]),
    // createDefaultTower(40, 500, ["C"]),
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

function createTowerHomeUI(x: number, y: number) {
    const root = document.createElement("div");
    root.style.borderRadius = "50%";
    root.style.background = "#00000088";
    root.style.position = "absolute";
    root.style.top = (y-50) + "px";
    root.style.left = (x-50) + "px";
    root.style.zIndex = "3";
    root.style.width = "100px";
    root.style.height = "100px";
    root.style.display = "flex";
    root.style.justifyItems = "center";
    root.style.justifyContent = "center";
    root.style.flexDirection = "column";
    
    root.focus();

    root.onblur = function () {
        document.body.removeChild(root);
    }
    root.onmouseleave = function () {
        document.body.removeChild(root);
    }

    const homebtn = document.createElement("button");
    homebtn.innerText = "Home"
    root.appendChild(homebtn);
    homebtn.style.height="20px";
    homebtn.onclick = function () {
        if (game.money >= game.homeCost) {
            const mousepos = getMousePos();
            game.homes.push({
                x: mousepos.x,
                y: mousepos.y,
                hp: 1000,
                maxHP: 1000
            });
            game.money -= game.homeCost;
        }
    }

    const towerbtn = document.createElement("button");
    towerbtn.innerText = "Tower";
    root.appendChild(towerbtn);
    towerbtn.style.height="20px";
    towerbtn.onclick = function () {
        if (
            getAllKeysDown().length != 0 && !isRepeatKeybind(getAllKeysDown())
        && getAllKeysDown().reduce((prev, curr) => prev && (curr.match(/^[0-9A-Z]$/g) !== null), true)
        && game.money >= game.towerCost
        ) {
            //setRightMouseDown(false);
            const mousepos = getMousePos();
            game.towers.push(createDefaultTower(mousepos.x, mousepos.y, getAllKeysDown()));
            game.money -= game.towerCost;
        }
    }

    document.body.appendChild(root);
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
        if (rightMouseDown
        ) {
            createTowerHomeUI(mousePosScreen.x, mousePosScreen.y);
        }
        updateTowers(game);
        updateEnemies(game);
        updateProjectiles(game);
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
