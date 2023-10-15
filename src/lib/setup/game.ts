import { Asteroid, Ship } from "$lib/objects";
import { isGamePaused, isGameStarted, stateGame, type StateGame } from "$lib/stores";
import { get } from "svelte/store";
import canvasConfig from "./canvasConfig";
import keysSystem from "./keysSystem";
import renderGame from "./renderGame";
import collisionSystem from "./collisionSystem";

export function game() {
    const { subscribeMoves, unSubscribeMoves } = keysSystem();
    const { collisionChecking, cancelCollisionChecking } = collisionSystem();

    function start() {
        if (get(isGameStarted)) return;
        const state = get(stateGame);
        const maxWave = 4;
        const ship = new Ship();

        state.ships = [ship];
        if (state.asteroids.length)
            state.asteroids = [];

        for (let i = 0; i < maxWave; i++) {
            state.asteroids = [new Asteroid(), ...state.asteroids]
        }

        subscribeMoves();
        collisionChecking();
        renderGame();

        isGameStarted.set(true);
    }

    function pause() {
        unSubscribeMoves();
        cancelCollisionChecking();
        renderGame.stopRender();

        isGamePaused.set(true);
    }

    function continueGame() {
        subscribeMoves();
        collisionChecking();
        renderGame();

        isGamePaused.set(false);
    }

    function reset() {
        renderGame.stopRender(true);
        isGamePaused.set(false);
        isGameStarted.set(false);

        cancelCollisionChecking();
        unSubscribeMoves();

        stateGame.set({ asteroids: [], ships: [] });
    }

    canvasConfig(document);

    return { start, pause, reset, continueGame }
}