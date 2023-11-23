import { Asteroid } from "$lib/objects";
import { stateGame } from "$lib/stores"
import { get } from "svelte/store";

export default function waveSystem() {
    let loopId = 0;
    const asteroidsEvents = {
        asteroidsSimple(asteroids: Asteroid[]) {
            asteroids.push(
                new Asteroid(),
                new Asteroid(),
                new Asteroid(),
                new Asteroid()
            )
        },
        meteorites(asteroids: Asteroid[]) {
            for (let index = 1; index < 20; index++) {
                let a = new Asteroid(3);

                while (asteroids.find(_a => _a.x === a.x && _a.y === a.y)) {
                    a = new Asteroid(3);
                }

                asteroids.push(a);
            }
        }
    }

    const waves = () => {
        const { asteroids } = get(stateGame);

        if (!asteroids.length) {
            asteroidsEvents.asteroidsSimple(asteroids);
        }
        loopId = requestAnimationFrame(waves);
    }

    const startWaves = () => {
        waves();
    }
    const stopWaves = () => {
        cancelAnimationFrame(loopId);
    }

    return {
        startWaves,
        stopWaves
    }
}