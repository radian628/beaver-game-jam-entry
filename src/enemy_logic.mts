import { getMousePos, keycombo } from "./controls.mjs";
import { Enemy, EnemyType, GameState, Home, Projectile, Tower, TowerType } from "./game_state.mjs";
import { distance, getClosest } from "./utils.mjs";


export function createDefaultEnemy(x: number, y: number): Enemy {

    let fireCooldown = 3;

    let fireTimeRemaining = 3;

    let fireRange = 150;

    return {
        x, y,
        hp: 100,
        maxHP: 100,
        radius: 10,
        onFire: (enemy: Enemy, home?: Home) => {
            if (!home) return;
            let angle = Math.atan2(enemy.y - home.y, enemy.x - home.x);
            let mag = distance(home, enemy);
            if (fireTimeRemaining > 0 || mag > fireRange) {
                return;
            } 

            fireTimeRemaining = fireCooldown;

            const dx = Math.cos(angle) * -10;
            const dy = Math.sin(angle) * -10;

            return {
                x: enemy.x, y: enemy.y,
                onMove: (proj: Projectile) => {
                    proj.x += dx;
                    proj.y += dy;
                },
                onHitTarget: (target, proj) => {
                    target.hp -= 15;
                    proj.lifetimeRemaining = 0;
                },
                radius: 10,
                lifetimeRemaining: 100
            }
        },
        onUpdate: (enemy: Enemy, home?: Home) => {
            fireTimeRemaining--;
            if (!home) return;
            let angle = Math.atan2(enemy.y - home.y, enemy.x - home.x);
            const dx = Math.cos(angle) * -0.2;
            const dy = Math.sin(angle) * -0.2;
            enemy.x += dx;
            enemy.y += dy;
        },
        type: EnemyType.DEFAULT
    }
} 

export function updateEnemies(game: GameState) {
    game.enemies.forEach(enemy => {
        const closestHome = getClosest(enemy.x, enemy.y, game.homes);
        enemy.onUpdate(enemy, closestHome);
        const proj = enemy.onFire(enemy, closestHome);
        if (proj) game.enemyProjectiles.push(proj);
    });
}