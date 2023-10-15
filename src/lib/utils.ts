export const random = (min: number, max: number) =>
	((Math.random() * (max - min + 1)) & 0xffffffff) + min;


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
