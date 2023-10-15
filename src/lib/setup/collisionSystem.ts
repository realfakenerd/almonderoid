import { Asteroid, type Bullet, type Ship } from "$lib/objects";
import { stateGame } from "$lib/stores";
import { get } from "svelte/store";

export default function collisionSystem() {
    let timer: number;

    function isCollision(obj: Ship | Bullet, asteroid: Asteroid) {

        const radiusSum: number = (11 + asteroid.collisionRadius) ** 2;
        const xDiff: number = (obj.x - asteroid.x) ** 2;
        const yDiff: number = (obj.y - asteroid.y) ** 2;

        return radiusSum > xDiff + yDiff;
    }

    function checkCollisions() {
        const { ships, asteroids } = get(stateGame);
        const [ship] = ships;

        for (const asteroid of asteroids) {

            if (isCollision(ship, asteroid)) {
                ship.reset();
            };

            for (const bullet of ship.bullets) {
                if (isCollision(bullet, asteroid)) {
                    const filterAsteroids: Asteroid[] = asteroids.filter(a => a.x !== asteroid.x && a.y !== asteroid.y);
                    const filterBullets: Bullet[] = ship.bullets.filter(b => b.x !== bullet.x && b.y !== bullet.y);

                    ship.bullets = filterBullets;

                    if (asteroid.level === 1) {

                        filterAsteroids.push(
                            new Asteroid(25, 2, 22, 2, asteroid.x, asteroid.y),
                            new Asteroid(25, 2, 22, 2, asteroid.x, asteroid.y)
                        );
                    }
                    if (asteroid.level === 2) {

                        filterAsteroids.push(
                            new Asteroid(15, 3, 12, 2.5, asteroid.x, asteroid.y),
                            new Asteroid(15, 3, 12, 2.5, asteroid.x, asteroid.y)
                        );
                    }

                    stateGame.set({
                        ships: [ship],
                        asteroids: filterAsteroids
                    });
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
