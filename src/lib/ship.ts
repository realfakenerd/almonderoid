import { canvasHeight, canvasWidth } from "./utils";


/** @classdesc We're creating a class called Ship that has a bunch of properties and methods that we can use to
create a ship object */
export default class Ship {
    visible = true;
    x = canvasWidth / 2;
    y = canvasHeight / 2;
    movingForward = false;
    speed = .1;
    velX = 0;
    velY = 0;
    rotateSpeed = .001;
    radius = 15;
    angle = 0;
    strokeColor = 'white';
    noseX = canvasWidth / 2 + 15;
    noseY = canvasHeight / 2;
    
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    /**
     * The constructor function is a special function that is called when an object is created from a
     * class
     * @param {HTMLCanvasElement} canvas - The canvas element that we're going to be drawing on.
     * @param {CanvasRenderingContext2D} ctx - CanvasRenderingContext2D - This is the context of the
     * canvas.
     */
    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;
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
        const radians = this.angle / Math.PI * 180;

        if (this.movingForward) {
            this.velX += Math.cos(radians) * this.speed;
            this.velY += Math.sin(radians) * this.speed;
        }
        if (this.x < this.radius) {
            this.x = this.canvas.width;
        }
        if (this.x > this.canvas.width) {
            this.x = this.radius;
        }
        if (this.y < this.radius) {
            this.y = this.canvas.height;
        }
        if (this.y > this.canvas.height) {
            this.y = this.radius;
        }

        this.velX *= .99;
        this.velY *= .99;

        this.x -= this.velX;
        this.y -= this.velY;
    }

    /**
     * We're drawing a triangle with the nose of the triangle pointing in the direction of the ship's
     * angle
     */
    draw() {
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.beginPath();
        const vertAngle = ((Math.PI * 2) / 3);
        const radians = this.angle / Math.PI * 180;
        this.noseX = this.x - this.radius * Math.cos(radians);
        this.noseY = this.y - this.radius * Math.sin(radians);
        let i = 0;
        for (i; i < 3; i++) {
            this.ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }
}