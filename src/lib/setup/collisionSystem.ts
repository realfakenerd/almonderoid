import { stateGame } from "$lib/stores";
import { get } from "svelte/store";

export default function collisionSystem() {
    let timer = {} as NodeJS.Timeout || null;

    function shipCollision() {
        const { ships, asteroids } = get(stateGame);
        const ship = ships[0];
        
        for (const asteroid of asteroids) {

            const radiusSum: number = (11 + asteroid.collisionRadius) ** 2;
            const xDiff: number = (ship.x - asteroid.x) ** 2;
            const yDiff: number = (ship.y - asteroid.y) ** 2;

            if (radiusSum > xDiff + yDiff) {
                ship.reset();
            };
        }
    }

    function bulletsCollision() {
        
    }

    function loopCollision() {
        timer = setInterval(shipCollision, 20);
    }

    function cancelLoop() {
        clearInterval(timer);
    }

    return {
        collisionChecking: loopCollision,
        cancelCollisionChecking: cancelLoop
    }
}
