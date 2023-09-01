import { CANVAS_HEIGHT, CANVAS_WIDTH, random } from '$lib/utils';
import Base from './Base';

/** The Asteroid class represents an asteroid object in a game, with properties such as position,
radius, level, collision radius, and speed, and methods for updating and drawing the asteroid. */
export default class Asteroid extends Base {
	radius: number;
	strokeColor = 'white';
	collisionRadius: number;
	level: number;
	radians = (this.angle / Math.PI) * 180;
	/**
	 * The constructor function is used to create a new instance of the class
	 * @param x - number = Math.floor(Math.random() * CANVAS_WIDTH),
	 * @param y - number = Math.floor(Math.random() * CANVAS_HEIGHT),
	 * @param [radius=50] - The radius of the circle.
	 * @param [level=1] - The level of the enemy. This is used to determine the color of the enemy.
	 * @param [collisionRadius=46] - The radius of the circle that will be used to detect collisions.
	 * @param [speed=1.5] - The speed at which the enemy moves.
	 */
	constructor(
		public canvas: HTMLCanvasElement,
		public ctx: CanvasRenderingContext2D,
		x = random(CANVAS_WIDTH, CANVAS_WIDTH * 2),
		y = random(CANVAS_HEIGHT, CANVAS_HEIGHT * 2),
		radius = 50,
		level = 1,
		collisionRadius = 46,
		speed = 1.5
	) {
		super(x, y, speed, random(1, 20));
		this.radius = radius;
		this.collisionRadius = collisionRadius;
		this.level = level;
	}

	/**
	 * If the x or y position of the particle is less than the radius, or greater than the width or
	 * height of the canvas, then set the x or y position to the opposite side of the canvas
	 */
	update() {
		this.#moveAsteroid();
		this.#wrapAroundCanvas();
	}

	#moveAsteroid() {
		this.x += Math.cos(this.radians) * this.speed;
		this.y += Math.sin(this.radians) * this.speed;
	}

	#wrapAroundCanvas() {
		if (this.x < this.radius) this.x = CANVAS_WIDTH;
		if (this.x > CANVAS_WIDTH) this.x = this.radius;
		if (this.y < this.radius) this.y = CANVAS_HEIGHT;
		if (this.y > CANVAS_HEIGHT) this.y = this.radius;
	}

	/**
	 * We're drawing a hexagon by drawing 6 lines from the center of the hexagon to the edge of the
	 * hexagon
	 */
	draw() {
		this.ctx.strokeStyle = this.strokeColor;
		this.ctx.beginPath();
		const vertAngle = (Math.PI * 2) / 6;
		let i = 0;
		for (i; i < 6; i++) {
			this.ctx.lineTo(
				this.x - this.radius * Math.cos(vertAngle * i + this.radians),
				this.y - this.radius * Math.sin(vertAngle * i + this.radians)
			);
		}
		this.ctx.closePath();
		this.ctx.stroke();
	}
}
