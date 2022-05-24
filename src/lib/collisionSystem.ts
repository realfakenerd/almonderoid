/**
 * If the distance between the two circles is less than the sum of their radii, then they are colliding
 * @param {number} p1x - The x position of the first circle.
 * @param {number} p1y - number,
 * @param {number} r1 - radius of the first circle
 * @param {number} p2x - number,
 * @param {number} p2y - number,
 * @param {number} r2 - number
 * @returns A boolean value.
 */
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

	if (radiusSum > Math.sqrt(xDiff * xDiff + yDiff * yDiff)) return true;
	return false;
}
