import { get } from 'svelte/store';
import { circleCollision } from './collisionSystem';
import { Asteroid, Bullet, Ship } from './objects';
import { highScore, isGameOver, isGameStarted, keyStore, lives, score } from './stores';
import { CANVAS_HEIGHT, CANVAS_WIDTH, resetShip } from './utils';

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

export let ship: Ship;
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let asteroids: Asteroid[] = [];
const keys: string[] = [];
let bullets: Bullet[] = [];

let simpleScore = 0;

let asteroidsWave = 4;
const maxAsteroids = 8;
const lsKeys = {
	forwardKey: '',
	leftKey: '',
	rightKey: '',
	shootKey: ''
};

keyStore.subscribe((val) => {
	lsKeys.forwardKey = val.forwardKey;
	lsKeys.leftKey = val.leftKey;
	lsKeys.rightKey = val.rightKey;
	lsKeys.shootKey = val.shootKey;
});

function drawObjects(objects: (Bullet | Asteroid)[]) {
	for (const obj of objects) {
		obj.draw();
		obj.update();
	}
}

/**
 * When a key is pressed, set the value of the keycode in the keys array to true.
 * @param e - KeyboardEvent - This is the event object that is passed to the function.
 */
export const handleKeydown = (e: KeyboardEvent) => {
	// @ts-expect-error i don know
	keys[e.key] = true;
};

/**
 * We're adding a new bullet to the bullets array, and we're using the ship's angle to determine the
 * direction of the bullet
 * @param {KeyboardEvent} e - KeyboardEvent - this is the event that is passed to the function.
 */
function handleKeyup(e: KeyboardEvent) {
	// @ts-expect-error i don know
	keys[e.key] = false;
	if (e.key === ' ' || e.key === get(keyStore).shootKey) {
		bullets = [new Bullet(ship.angle, ctx, ship), ...bullets];
	}
}

/**
 * We're checking for collisions between the ship and asteroids, and between bullets and asteroids. If
 * there's a collision, we're either resetting the ship or destroying the asteroid
 */
function renderGame() {
	requestAnimationFrame(renderGame);

	const isUpKeyPressed = keys[ArrowKeys.up] || keys[lsKeys.forwardKey];
	const isRightKeyPressed = keys[ArrowKeys.right] || keys[lsKeys.rightKey];
	const isLeftKeyPressed = keys[ArrowKeys.left] || keys[lsKeys.leftKey];

	ship.movingForward = isUpKeyPressed;

	if (isRightKeyPressed) {
		ship.rotate(1);
	}
	if (isLeftKeyPressed) {
		ship.rotate(-1);
	}
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	if (get(lives) <= 0) {
		document.body.removeEventListener('keydown', handleKeydown);
		document.body.removeEventListener('keyup', handleKeyup);

		ship.visible = false;

		isGameOver.set(true);
	}

	if (asteroids.length === 0) {
		resetShip(ship);
		lives.update((val) => (val += 1));
		let i = 0;
		asteroidsWave += 1;
		for (i; i < asteroidsWave; i++) {
			const asteroid = new Asteroid(canvas, ctx);
			asteroid.speed += 0.25;
			asteroids = [asteroid, ...asteroids];
		}
		if (asteroidsWave >= maxAsteroids) {
			asteroidsWave = 4;
		}
	}

	const bulletsToRemove: number[] = [];
	const asteroidsToRemove: number[] = [];

	let k = 0;
	for (k; k < asteroids.length; k++) {
		const asteroid = asteroids[k];
		const aPosX = asteroid.x;
		const aPosY = asteroid.y;
		const aPosRadius = asteroid.collisionRadius;

		if (circleCollision(ship.x, ship.y, 11, aPosX, aPosY, aPosRadius)) {
			resetShip(ship);
			lives.update((val) => (val -= 1));
		}

		for (let m = 0; m < bullets.length; m++) {
			const bullet = bullets[m];
			if (circleCollision(bullet.x, bullet.y, 3, aPosX, aPosY, aPosRadius)) {
				if (asteroid.level === 1) {
					asteroids.push(new Asteroid(canvas, ctx, aPosX - 5, aPosY - 5, 25, 2, 22, 2));
					asteroids.push(new Asteroid(canvas, ctx, aPosX + 5, aPosY + 5, 25, 2, 22, 2));
					score.update((val) => (val += 20));
				} else if (asteroid.level === 2) {
					asteroids.push(new Asteroid(canvas, ctx, aPosX - 5, aPosY - 5, 15, 3, 12, 2.5));
					asteroids.push(new Asteroid(canvas, ctx, aPosX + 5, aPosY + 5, 15, 3, 12, 2.5));
					score.update((val) => (val += 30));
				}

				bulletsToRemove.push(m);
				asteroidsToRemove.push(k);

				score.update((val) => {
					val += 15;
					simpleScore = val;
					return val;
				});
			}
		}
	}

	for (const index of asteroidsToRemove) {
		asteroids.splice(index, 1);
	}
	for (const index of bulletsToRemove) {
		bullets.splice(index, 1);
	}

	if (ship.visible) {
		ship.update();
		ship.draw();
		highScore.set(simpleScore);
	}
	if (bullets.length !== 0) {
		drawObjects(bullets);
	}

	if (asteroids.length !== 0) {
		drawObjects(asteroids);
	}
}

/**
 * It sets up the game
 * @param node - HTMLCanvasElement - The canvas element that we're going to be
 * drawing on.
 */
export default function setupGame() {
	canvas = document.getElementById('game') as HTMLCanvasElement;
	ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	isGameStarted.set(true);

	ship = new Ship(canvas, ctx);

	let i = 0;
	for (i; i < asteroidsWave; i++) {
		asteroids = [new Asteroid(canvas, ctx), ...asteroids];
	}

	document.body.addEventListener('keydown', handleKeydown);
	document.body.addEventListener('keyup', handleKeyup);

	if (localStorage.getItem('highscore')) {
		highScore.set(parseInt(localStorage.getItem('highscore') as string));
	} else {
		highScore.set(0);
	}

	renderGame();
}
