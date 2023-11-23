import { Ship } from "$lib/objects";
import { isGameOver, isGamePaused, isGameStarted, lives, score, stateGame } from "$lib/stores";
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
        isGameOver.set(false);
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
        score.set(0);
        lives.set(3);

        state.asteroids = [];
        state.ships = [];
    }

    lives.subscribe(live => {
        if (live === 0) {
            isGameOver.set(true);
            reset();
        }
    });
    canvasConfig(document);

    return { start, pause, reset, continueGame }
}