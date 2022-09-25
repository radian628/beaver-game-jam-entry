import { getMousePos, keycombo } from "./controls.mjs";
import { Enemy, EnemyType, GameState, Projectile, Tower, TowerType } from "./game_state.mjs";
import { distance } from "./utils.mjs";


export function createDefaultEnemy(x: number, y: number): Enemy {

    let fireCooldown = 3;

    let fireTimeRemaining = 3;

    let fireRange = 150;

    return {
        x, y,
        hp: 100,
        maxHP: 100,
        radius: 10,
        onFire: (enemy: Enemy, game: GameState) => {
            let angle = Math.atan2(enemy.y - game.home.y, enemy.x - game.home.x);
            let mag = distance(game.home, enemy);
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
        onUpdate: (enemy: Enemy, game: GameState) => {
            fireTimeRemaining--;
            let angle = Math.atan2(enemy.y - game.home.y, enemy.x - game.home.x);
            const dx = Math.cos(angle) * -2;
            const dy = Math.sin(angle) * -2;
            enemy.x += dx;
            enemy.y += dy;
        },
        type: EnemyType.DEFAULT
    }
} 

export function updateEnemies(game: GameState) {
    game.enemies.forEach(enemy => {
        enemy.onUpdate(enemy, game);
        const proj = enemy.onFire(enemy, game);
        if (proj) game.enemyProjectiles.push(proj);
    });
}