export function distance(p1: { x: number, y: number }, p2: { x: number, y: number }) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}