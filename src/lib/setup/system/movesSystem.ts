import { stateGame } from "$lib/stores";
import { get } from "svelte/store";

let timer = 0;

const moveObjects = () => {
    const { ships, asteroids } = get(stateGame);

    for (const ship of ships) {
        ship.update();

        for (const bullet of ship.bullets) {
            bullet.update();
        }
    }

    for (const asteroid of asteroids) {
        asteroid.update();
    }
};

const startMoves = () => {
    moveObjects();

    timer = requestAnimationFrame(startMoves);
}

const stopMoves = () => {
    cancelAnimationFrame(timer);
    timer = 0;
};

export {
    startMoves,
    stopMoves
}