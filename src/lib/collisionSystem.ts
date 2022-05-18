export function circleCollision(
    p1x: number,
    p1y: number,
    r1: number,
    p2x: number,
    p2y: number,
    r2: number
) {
    const radiusSum: number = r1 + r2;
    const xDiff: number = p1x - p2x;
    const yDiff: number = p1y - p2y;

    if (radiusSum > Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))) return true;
    return false;
}