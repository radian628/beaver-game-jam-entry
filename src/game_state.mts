// contains all the basic logic for projectiles
export type Projectile = {
    x: number,
    y: number,
    lifetimeRemaining: number,
    onMove: (proj: Projectile) => void,
    onHitTarget: (target: { hp: number }, proj: Projectile) => void,
    radius: number
}

export enum TowerType {
    DEFAULT
}

export const towerTextures: Record<TowerType, { base: string, cannon: string }> = {
    [TowerType.DEFAULT]: {
        base: "./assets/tower_base.png",
        cannon: "./assets/tower_cannon.png"
    }
}
// player-controlled towers
export type Tower = {
    x: number,
    y: number,
    hp: number,
    maxHP: number,
    ammo: number,
    maxAmmo: number,
    fireKeys: string[],
    fireKeyIndices: number[],
    type: TowerType,
    onFire: (tower: Tower) => Projectile | undefined,
    onUpdate: (tower: Tower) => void
}

export enum EnemyType {
    DEFAULT
}

export const enemyTextures: Record<EnemyType, string> = {
    [EnemyType.DEFAULT]: "./assets/default_enemy.png"
}
// game enemies
export type Enemy = {
    x: number,
    y: number,
    hp: number,
    maxHP: number,
    type: EnemyType,
    onFire: (enemy: Enemy, game: GameState) => Projectile | undefined,
    onUpdate: (enemy: Enemy, game: GameState) => void
}

export enum Screen {
    TITLE, GAME
}

// single monolithic object containing the entire state of the game
export type GameState = {
    towers: Tower[],
    enemies: Enemy[],
    towerProjectiles: Projectile[],
    enemyProjectiles: Projectile[]
    money: number,
    screen: Screen,
    home: {
        x: number,
        y: number,
        hp: number,
        maxHP: number
    }
}