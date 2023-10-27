import { Asteroid } from "$lib/objects";
import { score, stateGame } from "$lib/stores"
import { get } from "svelte/store";

export default function waveSystem() {
    let loopId = 0;
    
    const waves = () => {
        const { asteroids } = get(stateGame);

        if (!asteroids.length) {
            asteroids.push(
                new Asteroid(),
                new Asteroid(),
                new Asteroid(),
                new Asteroid()
            )
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