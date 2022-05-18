import { Bullet, ship } from "./setupGame";
import type Ship from "./ship";

export const enum ArrowKeys {
    up = 'ArrowUp',
    left = 'ArrowLeft',
    right = 'ArrowRight',
    shoot = 's'
}

export const enum KBKeys {
    up = 'w',
    left = 'a',
    right = 'd',
    shoot = 's'
}

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
export const handleKeyup = (e: KeyboardEvent) => {
    keys[(e as any).key] = false;
    if (e.key === ArrowKeys.shoot) {
        bullets = [new Bullet(ship.angle), ...bullets]
    }
};


export function resetShip(ship: Ship) {
    ship.x = canvasWidth / 2;
    ship.y = canvasHeight / 2;
    ship.velX = 0;
    ship.velY = 0;
}

export function print(ctx: CanvasRenderingContext2D, text: string, { positionX, positionY, size }: PrintOptions) {
    ctx.fillStyle = 'white';
    ctx.font = `${size || '21px'} Arial`;
    ctx.fillText(text, positionX, positionY);
}

export const canvasWidth = 640;
export const canvasHeight = 480;