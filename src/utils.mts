export function distance(p1: { x: number, y: number }, p2: { x: number, y: number }) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export function getClosest<T extends { x: number, y: number }>(x: number, y: number, targets: T[]) {
    let dist = Infinity;
    let candidate: T | undefined = undefined;
    for (let t of targets) {
        const thisDistance = distance({ x, y }, t);
        if (dist > thisDistance) {
            dist = thisDistance;
            candidate = t;
        }
    }

    return candidate;
}