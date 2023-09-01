import type { Ship } from './objects';


export const random = (min: number, max: number) =>
	((Math.random() * (max - min + 1)) & 0xffffffff) + min;
/**
 * It resets the ship's position and velocity to the center of the screen and zero, respectively
 * @param {Ship} ship - The ship object that we want to reset.
 */
export function resetShip(ship: Ship) {
	ship.x = CANVAS_WIDTH / 2;
	ship.y = CANVAS_HEIGHT / 2;
	ship.velX = 0;
	ship.velY = 0;
}

export const CANVAS_WIDTH = 640;
export const CANVAS_HEIGHT = 480;
