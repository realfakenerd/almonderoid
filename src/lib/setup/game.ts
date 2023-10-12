import { Asteroid, Ship } from "$lib/objects";
import { isGameStarted, renderLoopId, stateGame, type StateGame } from "$lib/stores";
import { get } from "svelte/store";
import canvasConfig from "./canvasConfig";
import keysSystem from "./keysSystem";
import renderGame from "./renderGame";

export function game() {
    const { canvas, ctx } = canvasConfig(document);
    const maxWave = 4;
    const stateGameStart: StateGame = {
        ships: [],
        asteroids: [],
        bullets: []
    }

    function start() {
        isGameStarted.set(true);
        const ship = new Ship(canvas, ctx);

        stateGameStart.ships.push(ship);

        for (let i = 0; i < maxWave; i++) {
            stateGameStart.asteroids = [new Asteroid(canvas, ctx), ...stateGameStart.asteroids]
        }

        stateGame.set(stateGameStart);

        keysSystem()
            .subscribeMoves();
        renderGame();
    }

    function pause() {
        cancelAnimationFrame(get(renderLoopId));
    }

    function reset() {
        cancelAnimationFrame(get(renderLoopId));
        stateGame.set({ships: [], asteroids: [], bullets: []});
        console.log(get(stateGame))
    }

    return { start, pause, reset }
}