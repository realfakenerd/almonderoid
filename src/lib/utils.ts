import { get } from 'svelte/store';
import { keyStore } from './stores';
import { Bullet, Ship, ship } from './setupGame';

export const keys: boolean[] = [];
export let bullets: Bullet[] = [];

/**
 * When a key is pressed, set the value of the keycode in the keys array to true.
 * @param {KeyboardEvent} e - KeyboardEvent - This is the event object that is passed to the function.
 */
export const handleKeydown = (e: KeyboardEvent) => {
	keys[(e as any).key] = true;
};

/**
 * We're adding a new bullet to the bullets array, and we're using the ship's angle to determine the
 * direction of the bullet
 * @param {KeyboardEvent} e - KeyboardEvent - this is the event that is passed to the function.
 */
export const handleKeyup = (e: KeyboardEvent) => {
	keys[(e as any).key] = false;
	if (e.key === ' ' || e.key === get(keyStore).shootKey) {
		bullets = [new Bullet(ship.angle), ...bullets];
	}
};

/**
 * It resets the ship's position and velocity to the center of the screen and zero, respectively
 * @param {Ship} ship - The ship object that we want to reset.
 */
export function resetShip(ship: Ship) {
	ship.x = canvasWidth / 2;
	ship.y = canvasHeight / 2;
	ship.velX = 0;
	ship.velY = 0;
}

export const canvasWidth = 640;
export const canvasHeight = 480;
