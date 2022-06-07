import { get } from 'svelte/store';
import { circleCollision } from './collisionSystem';
import { highScore, score, lives, isGameOver, isGameStarted, keyStore } from './stores';
import {
	bullets,
	canvasHeight,
	canvasWidth,
	handleKeydown,
	handleKeyup,
	keys,
	resetShip
} from './utils';

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

let simpleScore = 0;
const localStorageName = 'HighScore';

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

/**
 * We're checking for collisions between the ship and asteroids, and between bullets and asteroids. If
 * there's a collision, we're either resetting the ship or destroying the asteroid
 */
function renderGame() {
	requestAnimationFrame(renderGame);

	ship.movingForward =
		keys[ArrowKeys.up as unknown as number] || keys[lsKeys.forwardKey as unknown as number];

	if (keys[ArrowKeys.right as unknown as number] || keys[lsKeys.rightKey as unknown as number]) {
		ship.rotate(1);
	}
	if (keys[ArrowKeys.left as unknown as number] || keys[lsKeys.leftKey as unknown as number]) {
		ship.rotate(-1);
	}
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

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
			const asteroid = new Asteroid();
			asteroid.speed += 0.25;
			asteroids = [asteroid, ...asteroids];
		}
		if (asteroidsWave >= maxAsteroids) {
			asteroidsWave = 4;
		}
	}

	if (asteroids.length !== 0) {
		let k = 0;
		for (k; k < asteroids.length; k++) {
			if (
				circleCollision(
					ship.x,
					ship.y,
					11,
					asteroids[k].x,
					asteroids[k].y,
					asteroids[k].collisionRadius
				)
			) {
				resetShip(ship);
				lives.update((val) => (val -= 1));
			}
		}
	}

	if (asteroids.length !== 0 && bullets.length !== 0) {
		let l = 0;
		loop: for (l; l < asteroids.length; l++) {
			let m = 0;
			for (m; m < bullets.length; m++) {
				if (
					circleCollision(
						bullets[m].x,
						bullets[m].y,
						3,
						asteroids[l].x,
						asteroids[l].y,
						asteroids[l].collisionRadius
					)
				) {
					if (asteroids[l].level === 1) {
						asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 25, 2, 22, 2));
						asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5, 25, 2, 22, 2));
						score.update((val) => (val += 20));
					} else if (asteroids[l].level === 2) {
						asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 15, 3, 12, 2.5));
						asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5, 15, 3, 12, 2.5));
						score.update((val) => (val += 30));
					}
					asteroids.splice(l, 1);
					bullets.splice(m, 1);
					score.update((val) => {
						val += 15;
						simpleScore = val;
						return val;
					});

					break loop;
				}
			}
		}
	}

	if (ship.visible) {
		ship.update();
		ship.draw();
		highScore.update((val) => {
			localStorage.setItem(localStorageName, JSON.stringify(Math.max(simpleScore, val)));
			return Math.max(simpleScore, val);
		});
	}
	if (bullets.length !== 0) {
		let i = 0;
		for (i; i < bullets.length; i++) {
			bullets[i].update();
			bullets[i].draw();
		}
	}

	if (asteroids.length !== 0) {
		let i = 0;
		for (i; i < asteroids.length; i++) {
			asteroids[i].update();
			asteroids[i].draw();
		}
	}
}

/**
 * It sets up the game
 * @param {HTMLCanvasElement} node - HTMLCanvasElement - The canvas element that we're going to be
 * drawing on.
 */
export default function setupGame() {
	canvas = document.getElementById('game') as HTMLCanvasElement;
	ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
	isGameStarted.set(true);

	ship = new Ship();

	let i = 0;
	for (i; i < asteroidsWave; i++) {
		asteroids = [new Asteroid(), ...asteroids];
	}

	document.body.addEventListener('keydown', handleKeydown);
	document.body.addEventListener('keyup', handleKeyup);

	if (localStorage.getItem(localStorageName)) {
		highScore.set(parseInt(localStorage.getItem(localStorageName) as string));
	} else {
		highScore.set(0);
	}

	renderGame();
}

class Base {
	visible = true;
	x: number;
	y: number;
	speed: number;
	angle: number;
	/**
	 * The constructor function is a special function that is called when a new instance of the class is
	 * created
	 * @param {number} x - The x coordinate.
	 * @param {number} y - The y coordinate.
	 * @param {number} speed - The speed.
	 * @param {number} angle - The angle in radians that the object is traveling.
	 */
	constructor(x: number, y: number, speed: number, angle: number) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.angle = angle;
	}
}

/* It creates a bullet object that moves in the direction of the ship's nose */
export class Bullet extends Base {
	height = 4;
	width = 4;
	velX = 0;
	velY = 0;

	radians: number;
	/**
	 * The constructor function is a special function that is called when an object is created from a
	 * class
	 * @param {number} angle - The angle of the rotation in degrees.
	 */
	constructor(angle: number) {
		super(ship.noseX, ship.noseY, 5, angle);
		this.radians = (this.angle / Math.PI) * 180;
	}

	/**
	 * "Move the particle in the direction of its radians, at a speed of speed."
	 *
	 * The first line of the function subtracts the cosine of the particle's radians from the
	 * particle's x position. The second line subtracts the sine of the particle's radians from the
	 * particle's y position
	 */
	update() {
		this.x -= Math.cos(this.radians) * this.speed;
		this.y -= Math.sin(this.radians) * this.speed;
	}
	/**
	 * Draw a white rectangle at the x and y coordinates of the object, with the width and height of
	 * the object.
	 */
	draw() {
		ctx.fillStyle = '#fe3637';
		ctx.beginPath();
		ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI, false);
		ctx.fill();
	}
}

const random = (min: number, max: number) => ((Math.random() * (max - min + 1)) & 0xffffffff) + min;
/* The Asteroid class is used to create a new instance of the Asteroid class */
class Asteroid extends Base {
	radius: number;
	strokeColor = 'white';
	collisionRadius: number;
	level: number;
	radians = (this.angle / Math.PI) * 180;
	/**
	 * The constructor function is used to create a new instance of the class
	 * @param {number} x - number = Math.floor(Math.random() * canvasWidth),
	 * @param {number} y - number = Math.floor(Math.random() * canvasHeight),
	 * @param [radius=50] - The radius of the circle.
	 * @param [level=1] - The level of the enemy. This is used to determine the color of the enemy.
	 * @param [collisionRadius=46] - The radius of the circle that will be used to detect collisions.
	 * @param [speed=1.5] - The speed at which the enemy moves.
	 */
	constructor(
		x: number = random(canvasWidth, canvasWidth * 2),
		y: number = random(canvasHeight, canvasHeight * 2),
		radius = 50,
		level = 1,
		collisionRadius = 46,
		speed = 1.5
	) {
		super(x, y, speed, random(2, 359));
		this.radius = radius;
		this.collisionRadius = collisionRadius;
		this.level = level;
	}

	/**
	 * If the x or y position of the particle is less than the radius, or greater than the width or
	 * height of the canvas, then set the x or y position to the opposite side of the canvas
	 */
	update() {
		this.x += Math.cos(this.radians) * this.speed;
		this.y += Math.sin(this.radians) * this.speed;
		if (this.x < this.radius) {
			this.x = canvas.width;
		}
		if (this.x > canvas.width) {
			this.x = this.radius;
		}
		if (this.y < this.radius) {
			this.y = canvas.height;
		}
		if (this.y > canvas.height) {
			this.y = this.radius;
		}
	}
	/**
	 * We're drawing a hexagon by drawing 6 lines from the center of the hexagon to the edge of the
	 * hexagon
	 */
	draw() {
		ctx.strokeStyle = this.strokeColor;
		ctx.beginPath();
		const vertAngle = (Math.PI * 2) / 6;
		let i = 0;
		for (i; i < 6; i++) {
			ctx.lineTo(
				this.x - this.radius * Math.cos(vertAngle * i + this.radians),
				this.y - this.radius * Math.sin(vertAngle * i + this.radians)
			);
		}
		ctx.closePath();
		ctx.stroke();
	}
}

/** @classdesc We're creating a class called Ship that has a bunch of properties and methods that we can use to
create a ship object */
export class Ship extends Base {
	movingForward = false;
	velX = 0;
	velY = 0;
	rotateSpeed = 0.001;
	radius = 15;
	strokeColor = '#0978d2';
	noseX = canvasWidth / 2 + 15;
	noseY = canvasHeight / 2;

	constructor() {
		super(canvasWidth / 2, canvasHeight / 2, 0.04, 0);
	}

	/**
	 * This function takes a number as an argument and adds it to the angle property of the ship.
	 * @param {number} dir - The direction to rotate in. 1 for clockwise, -1 for counter-clockwise.
	 */
	rotate(dir: number) {
		this.angle += this.rotateSpeed * dir;
	}

	/**
	 * If the ship is moving forward, add the velocity to the ship's position
	 */
	update() {
		const radians = (this.angle / Math.PI) * 180;

		if (this.movingForward) {
			this.velX += Math.cos(radians) * this.speed;
			this.velY += Math.sin(radians) * this.speed;
		}
		if (this.x < this.radius) {
			this.x = canvas.width;
		}
		if (this.x > canvas.width) {
			this.x = this.radius;
		}
		if (this.y < this.radius) {
			this.y = canvas.height;
		}
		if (this.y > canvas.height) {
			this.y = this.radius;
		}

		this.velX *= 0.99;
		this.velY *= 0.99;

		this.x -= this.velX;
		this.y -= this.velY;
	}

	/**
	 * We're drawing a triangle with the nose of the triangle pointing in the direction of the ship's
	 * angle
	 */
	draw() {
		ctx.strokeStyle = this.strokeColor;
		ctx.beginPath();
		const vertAngle = (Math.PI * 2) / 3;
		const radians = (this.angle / Math.PI) * 180;
		this.noseX = this.x - this.radius * Math.cos(radians);
		this.noseY = this.y - this.radius * Math.sin(radians);
		let i = 0;
		for (i; i < 3; i++) {
			ctx.lineTo(
				this.x - this.radius * Math.cos(vertAngle * i + radians),
				this.y - this.radius * Math.sin(vertAngle * i + radians)
			);
		}
		ctx.closePath();
		ctx.stroke();
	}
}
