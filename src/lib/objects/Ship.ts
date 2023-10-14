import Base from './Base';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '$lib/utils';
import Bullet from './Bullet';

/** We're creating a class called Ship that has a bunch of properties and methods that we can use to
create a ship object */
export default class Ship extends Base {
	movingForward = false;
	velX = 0;
	velY = 0;
	rotateSpeed = 0.001;
	radius = 15;
	strokeColor = '#0978d2';
	noseX = CANVAS_WIDTH / 2 + 15;
	noseY = CANVAS_HEIGHT / 2;
	vertAngle = (Math.PI * 2) / 3;
	bullets: Bullet[] = [];
	fireInterval = 50;
	lastFireTime = 0;
	cadencyShoot = 100;
	#fireTimeout: NodeJS.Timeout | undefined;

	constructor(public canvas: HTMLCanvasElement, public ctx: CanvasRenderingContext2D) {
		super(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0.04, 0);
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
		if (this.x < this.radius) this.x = CANVAS_WIDTH;
		if (this.x > CANVAS_WIDTH) this.x = this.radius;
		if (this.y < this.radius) this.y = CANVAS_HEIGHT;
		if (this.y > CANVAS_HEIGHT) this.y = this.radius;

		this.velX *= 0.99;
		this.velY *= 0.99;

		this.x -= this.velX;
		this.y -= this.velY;
	}
	reset() {
		this.x = CANVAS_WIDTH / 2;
		this.y = CANVAS_HEIGHT / 2;
		this.velX = 0;
		this.velY = 0;
	}
	shoot() {
		const currentTime = Date.now();

		if (currentTime - this.lastFireTime >= this.fireInterval) {
			this.bullets = [new Bullet(this.angle, this.ctx, this), ...this.bullets]
			this.#fireTimeout = setInterval(
				() => this.bullets = [new Bullet(this.angle, this.ctx, this), ...this.bullets],
				this.cadencyShoot
			);
		}
		this.lastFireTime = currentTime;
	}
	stopShoot() {
		clearInterval(this.#fireTimeout);
		this.#fireTimeout = undefined;
	}
	/**
	 * We're drawing a triangle with the nose of the triangle pointing in the direction of the ship's
	 * angle
	 */
	draw() {
		this.ctx.strokeStyle = this.strokeColor;
		const radians = (this.angle / Math.PI) * 180;

		const cosR = Math.cos(radians);
		const sinR = Math.sin(radians);

		this.noseX = this.x - this.radius * cosR;
		this.noseY = this.y - this.radius * sinR;

		let i = 0;
		this.ctx.beginPath();
		for (i; i < 3; i++) {
			const angle = this.vertAngle * i + radians;
			this.ctx.lineTo(
				this.x - this.radius * Math.cos(angle),
				this.y - this.radius * Math.sin(angle)
			);
		}
		this.ctx.closePath();
		this.ctx.stroke();
	}
}
