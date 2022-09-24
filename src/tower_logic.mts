import { getMousePos, keycombo, keycomboindex } from "./controls.mjs";
import { GameState, Projectile, Tower, TowerType } from "./game_state.mjs";

export function getAngleToMouse(xp: number, yp: number) {
    const { x, y } = getMousePos();
    return Math.atan2(y - yp, x - xp);
}

export function createDefaultTower(x: number, y: number, fireKeys: string[]): Tower {

    let fireCooldown = 5;

    let fireTimeRemaining = 5;

    return {
        x, y,
        hp: 100,
        maxHP: 100,
        ammo: 10,
        maxAmmo: 10,
        fireKeyIndices: fireKeys.map(e => -1),
        fireKeys,
        type: TowerType.DEFAULT,
        onFire: (tower: Tower) => {
            let angle = getAngleToMouse(tower.x, tower.y);
            if (fireTimeRemaining > 0) {
                return;
            } 

            fireTimeRemaining = fireCooldown;

            const dx = Math.cos(angle) * 10;
            const dy = Math.sin(angle) * 10;

            return {
                x: tower.x, y: tower.y,
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
        onUpdate: (tower: Tower) => {
            fireTimeRemaining--;
        }
    }
} 

export function updateTowers(game: GameState) {
    game.towers.forEach(tower => {
        tower.onUpdate(tower);
        if (keycomboindex(tower.fireKeys, tower.fireKeyIndices)) {
            const projectile = tower.onFire(tower);
            if (projectile) game.towerProjectiles.push(projectile);
        }
    });
}