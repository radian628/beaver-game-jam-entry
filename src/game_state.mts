// contains all the basic logic for projectiles
export type Projectile = {
    x: number,
    y: number,
    lifetimeRemaining: number,
    onMove: () => void,
    onHitTarget: (target: { hp: number }) => void
}

// player-controlled towers
export type Tower = {
    x: number,
    y: number,
    hp: number,
    maxHP: number,
    fireKeys: string[],
    onFire: (tower: Tower) => Projectile
}

// game enemies
export type Enemy = {
    x: number,
    y: number,
    hp: number,
    maxHP: number,
    onFire: (enemy: Enemy) => Projectile
}

// single monolithic object containing the entire state of the game
export type GameState = {
    towers: Tower[],
    enemies: Enemy[],
    towerProjectiles: Projectile[],
    enemyProjectiles: Projectile[]
    money: number
}