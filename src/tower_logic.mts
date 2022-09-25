import { getMousePos, keycombo, keycomboindex } from "./controls.mjs";
import { GameState, NoteType, Projectile, Tower, TowerType } from "./game_state.mjs";

export function getAngleToMouse(xp: number, yp: number) {
    const { x, y } = getMousePos();
    return Math.atan2(y - yp, x - xp);
}

export function createDefaultTower(x: number, y: number, fireKeys: string[]): Tower {

    return {
        x, y,
        hp: 100,
        maxHP: 100,
        ammo: 10,
        maxAmmo: 10,
        fireTimeRemaining: 0,
        fireTimeCooldown: 200,
        fireKeyIndices: fireKeys.map(e => -1),
        fireKeys,
        type: TowerType.DEFAULT,
        onFire: (tower: Tower) => {
            let angle = getAngleToMouse(tower.x, tower.y);
            if (tower.fireTimeRemaining > 0) {
                return;
            } 

            tower.fireTimeRemaining = tower.fireTimeCooldown;

            const dx = Math.cos(angle) * 10;
            const dy = Math.sin(angle) * 10;

            return {
                x: tower.x, y: tower.y,
                onMove: (proj: Projectile) => {
                    proj.x += dx;
                    proj.y += dy;
                },
                onHitTarget: (target, proj) => {
                    target.hp -= 135;
                    proj.lifetimeRemaining = 0;
                },
                radius: 10,
                lifetimeRemaining: 100
            }
        },
        onUpdate: (tower: Tower) => {
            tower.fireTimeRemaining--;
        }
    }
} 

export function updateTowers(game: GameState) {
    game.towers.forEach(tower => {
        tower.onUpdate(tower);
        if (tower.fireTimeRemaining == 0) {
            game.notes.push({ x: tower.x, y: tower.y, radius: 30, lifetimeRemaining: 30, type: NoteType.RING });
        }
        if (keycomboindex(tower.fireKeys, tower.fireKeyIndices)) {
            const projectile = tower.onFire(tower);
            if (projectile) game.towerProjectiles.push(projectile);
        }
    });
}