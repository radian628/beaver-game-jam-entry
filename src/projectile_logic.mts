import { Enemy, GameState, Projectile, Tower } from "./game_state.mjs";
import { distance } from "./utils.mjs";



function updateSingleProjType<T extends (Tower | Enemy)>(projList: Projectile[], towerOrEnemyList: T[]) {
    projList.forEach(proj => {
        proj.onMove(proj);
        proj.lifetimeRemaining--;
        towerOrEnemyList.forEach(enemy => {
            const dist = distance(proj, enemy as (Tower | Enemy));
            if (dist < proj.radius) {
                proj.onHitTarget(enemy, proj);
            }
        })
    });
}


export function updateProjectiles(game: GameState) {
    updateSingleProjType(game.towerProjectiles, game.enemies);
    updateSingleProjType(game.enemyProjectiles, game.towers);

    game.towerProjectiles = game.towerProjectiles.filter(p => p.lifetimeRemaining > 0);
    game.enemyProjectiles = game.enemyProjectiles.filter(p => p.lifetimeRemaining > 0);

    game.towers = game.towers.filter(t => t.hp > 0);
    game.enemies = game.enemies.filter(t => t.hp > 0);
}