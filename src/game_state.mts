// contains all the basic logic for projectiles
export type Projectile = {
    x: number,
    y: number,
    lifetimeRemaining: number,
    onMove: (proj: Projectile) => void,
    onHitTarget: (target: { hp: number }, proj: Projectile) => void,
    radius: number
}

export type Resource = {
    x: number,
    y: number,
    amount: number,
    totalAmount: number
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
    fireTimeRemaining: number,
    fireTimeCooldown: number,
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

// "homes" that enemies will try to destroy
export type Home = {
    x: number,
    y: number,
    hp: number, 
    maxHP: number
}

export enum EnemyType {
    DEFAULT
}

export const enemyTextures: Record<EnemyType, string> = {
    [EnemyType.DEFAULT]: "./assets/enemy.png"
}
// game enemies
export type Enemy = {
    x: number,
    y: number,
    hp: number,
    maxHP: number,
    type: EnemyType,
    radius: number,
    onFire: (enemy: Enemy, home?: Home) => Projectile | undefined,
    onUpdate: (enemy: Enemy, home?: Home) => void
}

export enum Screen {
    TITLE, GAME, DEAD
}

export enum NoteType {
    TEXT, RING
}

type Note = {
    x: number,
    y: number,
    lifetimeRemaining: number,
} & ({
    type: NoteType.TEXT,
    text: string
} | {
    type: NoteType.RING,
    radius: number
});

type Particle = {
    x: number,
    y: number,
    dx: number,
    dy: number,
    lifetimeRemaining: number,
    color: string
}

// single monolithic object containing the entire state of the game
export type GameState = {
    towers: Tower[],
    enemies: Enemy[],
    towerProjectiles: Projectile[],
    enemyProjectiles: Projectile[],
    particles: Particle[],
    notes: Note[],
    money: number,
    totalMoney: number,
    towerCost: number,
    homeCost: number,
    screen: Screen,
    homes: Home[],
    resources: Resource[],
    timer: number,
    homeRadius: number,
    homeProximityRequirement: number
}