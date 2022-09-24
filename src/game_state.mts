// contains all the basic logic for projectiles
export type Projectile = {
    x: number,
    y: number,
    lifetimeRemaining: number,
    onMove: () => void,
    onHitTarget: (target: { hp: number }) => void
}

export enum TowerType {
    DEFAULT
}

export const towerTextures: Record<TowerType, string> = {
    [TowerType.DEFAULT]: "./assets/default_tower.png"
}
// player-controlled towers
export type Tower = {
    x: number,
    y: number,
    hp: number,
    maxHP: number,
    fireKeys: string[],
    type: TowerType,
    onFire: (tower: Tower) => Projectile
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
    onFire: (enemy: Enemy) => Projectile
}

enum Screen {
    TITLE, GAME
}

// single monolithic object containing the entire state of the game
export type GameState = {
    towers: Tower[],
    enemies: Enemy[],
    towerProjectiles: Projectile[],
    enemyProjectiles: Projectile[]
    money: number,
    screen: Screen
}