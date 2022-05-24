import { Bullet, Ship, ship } from './setupGame';

/* Creating an enum of the arrow keys. */
export const enum ArrowKeys {
	up = 'ArrowUp',
	left = 'ArrowLeft',
	right = 'ArrowRight',
	shoot = 's'
}

/* Creating an enum of the keyboard keys. */
export const enum KBKeys {
	up = 'w',
	left = 'a',
	right = 'd',
	shoot = 's'
}

/* An interface that is used to type the function print. */
interface PrintOptions {
	positionX: number;
	positionY: number;
	size?: string;
}
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
	if (e.key === ArrowKeys.shoot) {
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

/**
 * It takes a canvas context, a string, and an object with three properties, and it draws the string on
 * the canvas
 * @param {CanvasRenderingContext2D} ctx - CanvasRenderingContext2D - The context of the canvas.
 * @param {string} text - The text to be printed
 * @param {PrintOptions}  - CanvasRenderingContext2D - The context of the canvas.
 */
export function print(
	ctx: CanvasRenderingContext2D,
	text: string,
	{ positionX, positionY, size }: PrintOptions
) {
	ctx.fillStyle = 'white';
	ctx.font = `${size || '21px'} Arial`;
	ctx.fillText(text, positionX, positionY);
}

export const canvasWidth = 640;
export const canvasHeight = 480;
