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
    const stateGameDefault: StateGame = {
        ships: [],
        asteroids: []
    }

    function start() {
        if (get(isGameStarted)) return;

        const maxWave = 4;
        const newState = { ...stateGameDefault };
        const ship = new Ship();

        newState.ships = [ship];

        for (let i = 0; i < maxWave; i++) {
            newState.asteroids = [new Asteroid(), ...newState.asteroids]
        }

        stateGame.set(newState);

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