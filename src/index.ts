import { getAllKeysDown, getMousePos, keycombo, mousePosScreen, mouseDown, rightMouseDown, setRightMouseDown, viewBottom, viewTopLeft } from "./controls.mjs";
import { getimg, drawTitle, drawGame, drawDeadScreen } from "./draw.mjs";
import { createDefaultEnemy, updateEnemies } from "./enemy_logic.mjs";
import { enemyTextures, GameState, NoteType, Screen, towerTextures } from "./game_state.mjs";
import { updateHomes } from "./home_logic.mjs";
import { updateNotes } from "./note_logic.mjs";
import { updateParticles } from "./particle_logic.mjs";
import { updateProjectiles } from "./projectile_logic.mjs";
import { createDefaultTower, getAngleToMouse, updateTowers } from "./tower_logic.mjs";
import { distance } from "./utils.mjs";

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
    particles: [],
    towerProjectiles: [],
    enemyProjectiles: [],
    notes: [],
    resources: [...new Array(300).fill(0).map(() => {
        const amount = 30
        return {
            x: Math.random() * 15000 - 7500,
            y: Math.random() * 15000 - 7500,
            amount, totalAmount: amount
        }
    }), { x: 30, y: 30, amount: 30, totalAmount: 30 }],
    money: 60,
    totalMoney: 60,
    towerCost: 15,
    homeCost: 30,
    screen: Screen.TITLE,
    homes: [
        { x: 0, y: 0, hp: 1000, maxHP: 1000 },
    ],
    timer: 0,
    homeRadius: 250,
    homeProximityRequirement: 1000,
    homeMinimumProximityRequirement: 500
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

let towerHomeUIRoot: HTMLDivElement | undefined = undefined;

function createTowerHomeUI(x: number, y: number) {
    if (towerHomeUIRoot && towerHomeUIRoot.parentElement) {
        towerHomeUIRoot.parentElement.removeChild(towerHomeUIRoot);
    }
    placePosition.enabled = true;
    const pastMousePos = getMousePos();
    const root = document.createElement("div");
    towerHomeUIRoot = root;
    root.style.borderRadius = "50%";
    root.style.position = "absolute";
    root.style.top = (y-50) + "px";
    root.style.left = (x-50) + "px";
    root.style.zIndex = "3";
    root.style.width = "100px";
    root.style.height = "100px";
    root.style.display = "flex";
    root.style.justifyItems = "center";
    root.style.justifyContent = "space-evenly";
    root.style.flexDirection = "column";
    root.className = "tower-home-ui"

    root.focus();

    root.onblur = function () {
        document.body.removeChild(root);
        placePosition.enabled = false;
    }
    root.onmouseleave = function () {
        document.body.removeChild(root);
        placePosition.enabled = false;
    }

    const homebtn = document.createElement("button");
    homebtn.innerText = "Home $30";
    root.appendChild(homebtn);
    homebtn.style.height="20px";
    homebtn.onclick = function () {
        let isoutofrange = true;
        game.resources.forEach(resource => {
            if (distance(pastMousePos, resource) < game.homeRadius) {
                isoutofrange = false;
            }
        });

        if (isoutofrange) {
            game.notes.push({
                x: pastMousePos.x,
                y: pastMousePos.y,
                text: "Home is out of range of resources.",
                lifetimeRemaining: 120, type: NoteType.TEXT
            });
            return;
        }

        isoutofrange = true;
        game.homes.forEach(h => {
            if (distance(pastMousePos, h) < game.homeProximityRequirement) {
                isoutofrange = false;
            }
        });

        if (isoutofrange) {
            game.notes.push({
                x: pastMousePos.x,
                y: pastMousePos.y,
                text: "Home is out of range of other homes.",
                lifetimeRemaining: 120, type: NoteType.TEXT
            });
            return;
        }

        for (let h of game.homes) {
            if (distance(pastMousePos, h) < game.homeMinimumProximityRequirement) {
                game.notes.push({
                    x: pastMousePos.x,
                    y: pastMousePos.y,
                    text: "Home is too close to other homes.",
                    lifetimeRemaining: 120, type: NoteType.TEXT
                });
                return;
            }
        }

        if (game.money >= game.homeCost) {
            game.homes.push({
                x: pastMousePos.x,
                y: pastMousePos.y,
                hp: 1000,
                maxHP: 1000
            });
            game.money -= game.homeCost;
            root.blur();
        } else {
            game.notes.push({
                x: pastMousePos.x,
                y: pastMousePos.y,
                text: "Insufficient funds.",
                lifetimeRemaining: 120, type: NoteType.TEXT
            });
        }
    }

    const towerbtn = document.createElement("button");
    towerbtn.innerText = "Tower $15";
    root.appendChild(towerbtn);
    towerbtn.style.height="20px";
    towerbtn.onclick = function () {
        function addNote(text: string, duration?: number) {
            game.notes.push({
                x: pastMousePos.x,
                y: pastMousePos.y,
                text,
                lifetimeRemaining: duration ?? 120, type: NoteType.TEXT
            });
        }

        if (getAllKeysDown().length == 0) {
            addNote("You must press one or more keys while placing a tower", 240);
            return;
        }

        if (isRepeatKeybind(getAllKeysDown())) {
            addNote(`A tower already exists with keybind '${getAllKeysDown().join("+")}'`, 240);
            return;
        }

        if (!getAllKeysDown().reduce((prev, curr) => prev && (curr.match(/^[0-9A-Z]$/g) !== null), true)) {
            addNote("All keys must be alphanumeric.");
            return;
        }

        if (game.money < game.towerCost) {
            addNote("Insufficient funds.");
            return;
        }
            //setRightMouseDown(false);
        game.towers.push(createDefaultTower(pastMousePos.x, pastMousePos.y, getAllKeysDown()));
        game.money -= game.towerCost;
        root.blur();
    }

    document.body.appendChild(root);
}

export let placePosition = { x: 0, y: 0, enabled: false };

async function gameLoop() {
    if (!ctx) {
        window.alert("canvas error that should nver evr happen");
        throw "";
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (game.screen == Screen.DEAD){
        drawDeadScreen(ctx, game);
        if(getAllKeysDown().length >0)
            game.screen = Screen.TITLE;
    } else if (game.screen == Screen.TITLE) {
        drawTitle(ctx, game);
        if(mouseDown){
            console.log(getMousePos());
            if((mousePosScreen.x-canvas.width/2) ** 2 + (mousePosScreen.y-canvas.height/2) ** 2 < (Math.min(canvas.width, canvas.height)/2)**2 && mousePosScreen.y > canvas.height/2){
                if(mousePosScreen.x < canvas.width/2){
                    window.open('https://radian628.github.io/important');
                }
                else{
                    game = {
                        towers: [],
                        enemies: [],
                        particles: [],
                        towerProjectiles: [],
                        enemyProjectiles: [],
                        notes: [],
                        resources: [...new Array(300).fill(0).map(() => {
                            const amount = 30
                            return {
                                x: Math.random() * 15000 - 7500,
                                y: Math.random() * 15000 - 7500,
                                amount, totalAmount: amount
                            }
                        }), { x: 30, y: 30, amount: 30, totalAmount: 30 }],
                        money: 60,
                        totalMoney: 60,
                        towerCost: 15,
                        homeCost: 30,
                        screen: Screen.TITLE,
                        homes: [
                            { x: 0, y: 0, hp: 1000, maxHP: 1000 },
                        ],
                        timer: 0,
                        homeRadius: 250,
                        homeProximityRequirement: 1000
                    };
                    game.screen = Screen.GAME;
                }
            }
        }
    } else if (game.screen == Screen.GAME) {
        if (game.homes.length == 0) {
            game.screen = Screen.DEAD;

        }
        drawGame(ctx, game);
        if (game.timer % 600 == 0) {
            let angle = Math.random() * Math.PI * 2;
            let mag = Math.random() * 3000 + 8000;
            for (let i = 0; i < game.timer / 1500; i++) {
                game.enemies.push(
                    createDefaultEnemy(
                        Math.cos(angle) * mag + Math.random() * 6000 - 3000,
                        Math.sin(angle) * mag + Math.random() * 6000 - 3000
                    ),
                )
            }
        }
        if (rightMouseDown
        ) {
            placePosition.x = getMousePos().x;
            placePosition.y = getMousePos().y;
            createTowerHomeUI(mousePosScreen.x, mousePosScreen.y);
        }
        updateTowers(game);
        updateEnemies(game);
        updateProjectiles(game);
        updateHomes(game);
        updateNotes(game);
        updateParticles(game);
    }

    game.timer++;

    requestAnimationFrame(gameLoop);
}

gameLoop();
