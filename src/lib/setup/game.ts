import { Asteroid, Ship } from "$lib/objects";
import { isGamePaused, isGameStarted, lives, stateGame } from "$lib/stores";
import { get } from "svelte/store";
import canvasConfig from "./config/canvasConfig";
import keysSystem from "./system/keysSystem";
import renderGame from "./renderer/renderGame";
import collisionSystem from "./system/collisionSystem";
import movesSystem from "./system/movesSystem";

export function game() {
    const { subscribeMoves, unSubscribeMoves } = keysSystem();
    const { collisionChecking, cancelCollisionChecking } = collisionSystem();
    const { startMoves, stopMoves } = movesSystem();

    function start() {
        if (get(isGameStarted)) return;
        const state = get(stateGame);
        const maxWave = 4;
        const ship = new Ship();

        state.ships = [ship];

        for (let i = 0; i < maxWave; i++) {
            state.asteroids = [new Asteroid(), ...state.asteroids]
        }
        
        lives.set(3);

        subscribeMoves();
        collisionChecking();
        startMoves();
        renderGame();
        
        isGameStarted.set(true);
    }

    function pause() {
        stopMoves();
        unSubscribeMoves();
        cancelCollisionChecking();
        renderGame.stopRender();

        isGamePaused.set(true);
    }

    function continueGame() {
        subscribeMoves();
        collisionChecking();
        startMoves();
        renderGame();

        isGamePaused.set(false);
    }
    
    function reset() {
        const state = get(stateGame);

        renderGame.stopRender(true);
        isGamePaused.set(false);
        isGameStarted.set(false);
        
        stopMoves();
        cancelCollisionChecking();
        unSubscribeMoves();

        state.asteroids = [];
        state.ships = [];
    }

    canvasConfig(document);

    return { start, pause, reset, continueGame }
}