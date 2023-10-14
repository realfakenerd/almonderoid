import { Asteroid, Ship } from "$lib/objects";
import { isGamePaused, isGameStarted, renderLoopId, stateGame, type StateGame } from "$lib/stores";
import { get } from "svelte/store";
import canvasConfig from "./canvasConfig";
import keysSystem from "./keysSystem";
import renderGame from "./renderGame";

export function game() {
    const { canvas, ctx } = canvasConfig(document);
    const {subscribeMoves, unSubscribeMoves} = keysSystem();
    const maxWave = 4;
    const stateGameDefault: StateGame = {
        ships: [],
        asteroids: [],
        bullets: []
    }

    function start() {
        if (get(isGameStarted)) return;

        isGameStarted.set(true);
        const newState = { ...stateGameDefault };
        const ship = new Ship(canvas, ctx);

        newState.ships = [ship];

        for (let i = 0; i < maxWave; i++) {
            newState.asteroids = [new Asteroid(canvas, ctx), ...newState.asteroids]
        }

        stateGame.set(newState);

        subscribeMoves();
        renderGame();
    }

    function pause() {
        isGamePaused.set(true);
        cancelAnimationFrame(get(renderLoopId));
    }
    
    function continueGame() {
        unSubscribeMoves();
        isGamePaused.set(false);
        subscribeMoves();
        renderGame();
    }

    function reset() {
        if (!get(isGamePaused))
            cancelAnimationFrame(get(renderLoopId));

        isGamePaused.set(false);
        isGameStarted.set(false);
        unSubscribeMoves();
        start();
    }

    return { start, pause, reset, continueGame }
}