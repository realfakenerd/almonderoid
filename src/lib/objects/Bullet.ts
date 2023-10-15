import { stateGame } from '$lib/stores';
import { get } from 'svelte/store';
import Base from './Base';

/** The Bullet class represents a bullet object with a specific position, size, velocity, and angle of
rotation, and it can be updated and drawn on a canvas. */
export default class Bullet extends Base {
	height = 4;
	width = 4;
	velX = 0;
	velY = 0;

	radians = 0;
	/**
	 * The constructor function is a special function that is called when an object is created from a
	 * class
	 * @param {number} angle - The angle of the rotation in degrees.
	 */
	constructor() {
		const [{noseX, noseY, angle}] = get(stateGame).ships;

		super(noseX, noseY, 5, angle);
		this.radians = (angle / Math.PI) * 180;
	}

	/**
	 * "Move the particle in the direction of its radians, at a speed of speed."
	 *
	 * The first line of the function subtracts the cosine of the particle's radians from the
	 * particle's x position. The second line subtracts the sine of the particle's radians from the
	 * particle's y position
	 */
	update() {
		const cosAngle = Math.cos(this.radians); // Armazena os resultados em variáveis
		const sinAngle = Math.sin(this.radians);

		this.x -= cosAngle * this.speed;
		this.y -= sinAngle * this.speed;
	}
	/**
	 * Draw a white rectangle at the x and y coordinates of the object, with the width and height of
	 * the object.
	 */
	draw() {
		this.ctx.fillStyle = '#fe3637';
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI, false);
		this.ctx.fill();
	}
}
