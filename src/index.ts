import { keycombo } from "./controls.mjs";
import { GameState, Screen } from "./game_state.mjs";
import { updateProjectiles } from "./projectile_logic.mjs";
import { createDefaultTower, updateTowers } from "./tower_logic.mjs";

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");


console.log("got here!");   

let game: GameState = {
    towers: [],
    enemies: [],
    towerProjectiles: [],
    enemyProjectiles: [],
    money: 0,
    screen: Screen.GAME
}

game.towers.push(
    createDefaultTower(40, 50, ["a"]),
    createDefaultTower(400, 50, ["b"]),
    createDefaultTower(40, 500, ["c"]),
)

function gameLoop() {
    if (!ctx) {
        window.alert("Failed to create canvas context.");
        throw new Error("stupid canvas isnt working");
    }
    
    canvas.width = canvas.width;
    game.towers.forEach(t => {
        ctx.fillRect(t.x - 5, t.y - 5, 10, 10);
    });
    game.towerProjectiles.forEach(t => {
        ctx.fillRect(t.x - 2, t.y - 2, 4, 4);
    });

    updateTowers(game);
    updateProjectiles(game);
    requestAnimationFrame(gameLoop);
}

gameLoop();