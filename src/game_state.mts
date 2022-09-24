export type Tower = {
    x: number,
    y: number,
    hp: number,
    maxHP: number
}

export type Enemy = {
    x: number,
    y: number,
    hp: number,
    maxHP: number
}

export type GameState = {
    towers: Tower[],
    enemies: Enemy[],
    money: number
}