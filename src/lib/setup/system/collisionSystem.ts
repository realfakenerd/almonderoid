import { Asteroid, type Bullet, type Ship } from "$lib/objects";
import { Point } from "$lib/objects/Point";
import { lives, stateGame } from "$lib/stores";
import { get } from "svelte/store";

export default function collisionSystem() {
    let timer: number;

    function isCollision(obj: Ship | Bullet, asteroid: Asteroid) {
        const radiusSum: number = (11 + asteroid.collisionRadius) ** 2;
        const xDiff: number = (obj.x - asteroid.x) ** 2;
        const yDiff: number = (obj.y - asteroid.y) ** 2;

        return radiusSum > xDiff + yDiff;
    }

    const collisionInterval = 3000;
    let lastShipCollision = Date.now();

    function checkCollisions() {
        const state = get(stateGame)
        const { ships, asteroids } = state;

        const currentTime = Date.now();
        for (const asteroid of asteroids) {
            for (const ship of ships) {
                if (isCollision(ship, asteroid)) {
                    if (currentTime - lastShipCollision >= collisionInterval) {
                        lives.update(val => val - 1);
                        ship.reset();

                        lastShipCollision = currentTime;
                    };
                };

                for (const bullet of ship.bullets) {
                    if (isCollision(bullet, asteroid)) {
                        const filterAsteroids: Asteroid[] = asteroids.filter(a => a !== asteroid);
                        const filterBullets: Bullet[] = ship.bullets.filter(b => b !== bullet);

                        if (asteroid.level === 1) {

                            filterAsteroids.push(
                                new Asteroid(2, asteroid),
                                new Asteroid(2, asteroid)
                            );
                        }
                        if (asteroid.level === 2) {

                            filterAsteroids.push(
                                new Asteroid(3, asteroid),
                                new Asteroid(3, asteroid)
                            );
                        }

                        state.points = [new Point(asteroid), ...state.points]
                        ship.bullets = filterBullets;
                        state.asteroids = filterAsteroids;
                    }
                }
            }
        }
    }

    function loopCollision() {
        checkCollisions();
        timer = requestAnimationFrame(loopCollision);
    }

    function cancelLoop() {
        cancelAnimationFrame(timer);
        timer = 0;
    }

    return {
        collisionChecking: loopCollision,
        cancelCollisionChecking: cancelLoop
    }
}
