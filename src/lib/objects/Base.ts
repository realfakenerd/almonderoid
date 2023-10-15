import { canvasStore, ctxStore } from "$lib/stores";
import { get } from "svelte/store";

/** The Base class represents an object with coordinates, speed, and angle in a TypeScript program. */
export default class Base {
	visible = true;
	x: number;
	y: number;
	speed: number;
	angle: number;
	canvasWidth: number;
	canvasHeight: number;
	/**
	 * The constructor function is a special function that is called when a new instance of the class is
	 * created
	 * @param {number} x - The x coordinate.
	 * @param {number} y - The y coordinate.
	 * @param {number} speed - The speed.
	 * @param {number} angle - The angle in radians that the object is traveling.
	 */
	constructor(
		x: number,
		y: number,
		speed: number,
		angle: number,
		public canvas: HTMLCanvasElement = get(canvasStore),
		public ctx: CanvasRenderingContext2D = get(ctxStore)
	) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.angle = angle;
		this.canvasWidth = canvas.width;
		this.canvasHeight = canvas.height;
	}
}