import { writable } from "svelte/store";
import { circleCollision } from "./collisionSystem";
import Ship from "./ship";
import { ArrowKeys, bullets, canvasHeight, canvasWidth, handleKeydown, handleKeyup, KBKeys, keys, print, resetShip } from "./utils";

export let ship: Ship;
export let canvas: HTMLCanvasElement;
export let ctx: CanvasRenderingContext2D;

export const score = writable(0);
export const highScore = writable(0);

let simpleScore = 0;
const localStorageName = "HighScore";


const maxAsteroids = 4;

let lives = 3;
let asteroids: Asteroid[] = [];

export const finishedLoading = writable(false);

export default function setupGame(node: HTMLCanvasElement) {
    ctx = node.getContext('2d') as CanvasRenderingContext2D;
    canvas = node;

    ship = new Ship(node, ctx as CanvasRenderingContext2D);

    let i = 0;
    for (i; i < maxAsteroids; i++) {
        asteroids = [new Asteroid(), ...asteroids];
    }

    document.body.addEventListener('keydown', handleKeydown);
    document.body.addEventListener('keyup', handleKeyup);

    if (localStorage.getItem(localStorageName)) {
        highScore.set(parseInt(localStorage.getItem(localStorageName) as string));
    } else {
        highScore.set(0);
    }

    finishedLoading.set(true);
    renderGame();
}

function renderGame() {
    ship.movingForward = (keys[ArrowKeys.up as unknown as number] || keys[KBKeys.up  as unknown as number]);

    if (keys[ArrowKeys.right as unknown as number] || keys[KBKeys.right as unknown as number]) {
        ship.rotate(1);
    }
    if (keys[ArrowKeys.left as unknown as number] || keys[KBKeys.left as unknown as number]) {
        ship.rotate(-1);
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (lives <= 0) {
        document.body.removeEventListener('keydown', handleKeydown);
        document.body.removeEventListener('keyup', handleKeyup);

        ship.visible = false;

        print(ctx, 'GAME OVER', {
            positionX: canvasWidth / 2 - 150,
            positionY: canvasHeight / 2,
            size: '50px'
        });
    }

    if (asteroids.length === 0) {
        resetShip(ship);
        lives++;
        let i = 0;
        for (i; i < maxAsteroids; i++) {
            const asteroid = new Asteroid();
            asteroid.speed += .25;
            asteroids = [asteroid, ...asteroids];
        }
    }

    drawLifeShips();

    if (asteroids.length !== 0) {
        let k = 0;
        for (k; k < asteroids.length; k++) {
            if (circleCollision(
                ship.x,
                ship.y,
                11,
                asteroids[k].x,
                asteroids[k].y,
                asteroids[k].collisionRadius
            )) {
                resetShip(ship);
                lives -= 1;
            }
        }
    }

    if (asteroids.length !== 0 && bullets.length !== 0) {
        let l = 0;
        loop: for (l; l < asteroids.length; l++) {
            let m = 0;
            for (m; m < bullets.length; m++) {
                if (circleCollision(bullets[m].x, bullets[m].y, 3, asteroids[l].x, asteroids[l].y, asteroids[l].collisionRadius)) {
                    if (asteroids[l].level === 1) {
                        asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 25, 2, 22, 2));
                        asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5, 25, 2, 22, 2));

                    } else if (asteroids[l].level === 2) {
                        asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 15, 3, 12, 2.5));
                        asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5, 15, 3, 12, 2.5));
                    }
                    asteroids.splice(l, 1);
                    bullets.splice(m, 1);
                    score.update(val => {
                        val += 20
                        simpleScore = val;
                        return val
                    });

                    break loop;
                }
            }
        }
    }

    if (ship.visible) {
        ship.update();
        ship.draw();
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

    
    highScore.update(val => {
        localStorage.setItem(localStorageName, JSON.stringify(Math.max(simpleScore,val)));
        return Math.max(simpleScore,val)
    });
    requestAnimationFrame(renderGame);
}

export class Bullet {
    visible = true;
    x = ship.noseX;
    y = ship.noseY;
    angle: number;
    height = 4;
    width = 4;
    speed = 5;
    velX = 0;
    velY = 0;

    radians: number;
    constructor(angle: number) {
        this.angle = angle;
        this.radians = this.angle / Math.PI * 180;
    }

    update() {
        this.x -= Math.cos(this.radians) * this.speed;
        this.y -= Math.sin(this.radians) * this.speed;
    }
    draw() {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Asteroid {
    visible = true;
    x: number;
    y: number;
    speed: number;
    radius: number;
    angle = Math.floor(Math.random() * 359);
    strokeColor = 'white';
    collisionRadius: number;
    level: number;
    radians = this.angle / Math.PI * 180;
    constructor(
        x: number = Math.floor(Math.random() * canvasWidth),
        y: number = Math.floor(Math.random() * canvasHeight),
        radius = 50,
        level = 1,
        collisionRadius = 46,
        speed = 1.5
    ) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.collisionRadius = collisionRadius;
        this.level = level;
        this.speed = speed;
    }

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
    draw() {
        ctx.beginPath();
        const vertAngle = ((Math.PI * 2) / 6);

        let i = 0;
        for (i; i < 6; i++) {
            ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + this.radians), this.y - this.radius * Math.sin(vertAngle * i + this.radians));
        }
        ctx.closePath();
        ctx.stroke();
    }
}

function drawLifeShips() {
    let startX = canvasWidth / 2;
    const startY = 10;
    const points: [[number, number], [number, number]] = [[9, 9], [-9, 9]];
    ctx.strokeStyle = 'white';

    let i = 0;
    for (i; i < lives; i++) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        let j = 0;
        for (j; j < points.length; j++) {
            ctx.lineTo(startX + points[j][0], startY + points[j][1]);
        }
        ctx.closePath();
        ctx.stroke();
        startX -= 30;
    }
}

