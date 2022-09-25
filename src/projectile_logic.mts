import { Enemy, GameState, Projectile, Tower } from "./game_state.mjs";
import { distance } from "./utils.mjs";



function updateSingleProjType<T extends { x: number, y: number, hp: number, maxHP: number, radius?: number }>(projList: Projectile[], towerOrEnemyList: T[]) {
    projList.forEach(proj => {
        proj.onMove(proj);
        proj.lifetimeRemaining--;
        towerOrEnemyList.forEach(enemy => {
            const dist = distance(proj, enemy);
            if (dist < proj.radius + ((enemy.radius as number | undefined) ?? 0)) {
                proj.onHitTarget(enemy, proj);
            }
        })
    });
}


export function updateProjectiles(game: GameState) {
    updateSingleProjType(game.towerProjectiles, game.enemies);
    updateSingleProjType(game.enemyProjectiles, game.homes);
    // game.enemyProjectiles.forEach(proj => {
    //     proj.onMove(proj);
    //     proj.lifetimeRemaining--;
    //     const dist = distance(proj, game.home);
    //     if (dist < proj.radius) {
    //         proj.onHitTarget(game.home, proj);
    //     }
    // });

    game.towerProjectiles = game.towerProjectiles.filter(p => p.lifetimeRemaining > 0);
    game.enemyProjectiles = game.enemyProjectiles.filter(p => p.lifetimeRemaining > 0);

    game.enemies.forEach(e => {
        if (e.hp <= 0) {
            for (let i = 0; i < 200; i++) {
                let angle = Math.random() * Math.PI * 2;
                game.particles.push({
                    x: e.x, y: e.y,
                    dx: Math.cos(angle) * Math.random() * 24,
                    dy: Math.sin(angle) * Math.random() * 24,
                    lifetimeRemaining: Math.random() * 140,
                    color: `rgb(${Math.random() * 50 + 200}, ${Math.random() * 150}, ${Math.random() * 150})`
                });
            }
        }
    });

    game.towers = game.towers.filter(t => t.hp > 0);
    game.enemies = game.enemies.filter(t => t.hp > 0);
    game.homes = game.homes.filter(t => t.hp > 0);
}