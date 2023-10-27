import { Ship } from "$lib/objects";
import { isGamePaused, isGameStarted, lives, stateGame } from "$lib/stores";
import { get } from "svelte/store";
import canvasConfig from "./config/canvasConfig";
import renderGame from "./renderer/renderGame";
import { collisionSystem, keysSystem, movesSystem, waveSystem } from "./system";


export function game() {
    const { subscribeMoves, unSubscribeMoves } = keysSystem();
    const { collisionChecking, cancelCollisionChecking } = collisionSystem();
    const { startMoves, stopMoves } = movesSystem();
    const { startWaves, stopWaves } = waveSystem();

    function start() {
        if (get(isGameStarted)) return;
        const state = get(stateGame);
        const ship = new Ship();

        state.ships = [ship];

        lives.set(3);

        subscribeMoves();
        collisionChecking();
        startMoves();
        renderGame();
        startWaves();
        
        isGameStarted.set(true);
    }

    function pause() {
        stopWaves();
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
        startWaves();
        
        isGamePaused.set(false);
    }

    function reset() {
        const state = get(stateGame);

        renderGame.stopRender(true);
        isGamePaused.set(false);
        isGameStarted.set(false);
        
        stopWaves();
        stopMoves();
        cancelCollisionChecking();
        unSubscribeMoves();

        state.asteroids = [];
        state.ships = [];
    }

    canvasConfig(document);

    return { start, pause, reset, continueGame }
}