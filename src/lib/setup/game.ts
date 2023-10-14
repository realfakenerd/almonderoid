import { Asteroid, Ship } from "$lib/objects";
import { isGamePaused, isGameStarted, renderLoopId, stateGame, type StateGame } from "$lib/stores";
import { get } from "svelte/store";
import canvasConfig from "./canvasConfig";
import keysSystem from "./keysSystem";
import renderGame from "./renderGame";
import collisionSystem from "./collisionSystem";

export function game() {
    const { canvas, ctx } = canvasConfig(document);
    const { subscribeMoves, unSubscribeMoves } = keysSystem();
    const { collisionChecking, cancelCollisionChecking } = collisionSystem();
    const stateGameDefault: StateGame = {
        ships: [],
        asteroids: [],
        bullets: []
    }

    function start() {
        if (get(isGameStarted)) return;
        
        const maxWave = 4;
        const newState = { ...stateGameDefault };
        const ship = new Ship(canvas, ctx);

        newState.ships = [ship];

        for (let i = 0; i < maxWave; i++) {
            newState.asteroids = [new Asteroid(canvas, ctx), ...newState.asteroids]
        }

        stateGame.set(newState);

        subscribeMoves();
        collisionChecking();
        renderGame();
        
        isGameStarted.set(true);
    }

    function pause() {
        const renderLoop = get(renderLoopId);
        
        cancelCollisionChecking();
        unSubscribeMoves();
        cancelAnimationFrame(renderLoop);

        isGamePaused.set(true);
    }
    
    function continueGame() {
        
        subscribeMoves();
        collisionChecking();
        renderGame();
        
        isGamePaused.set(false);
    }

    function reset() {
        if (!get(isGamePaused))
            cancelAnimationFrame(get(renderLoopId));

        isGamePaused.set(false);
        isGameStarted.set(false);

        cancelCollisionChecking();
        unSubscribeMoves();
        start();
    }

    return { start, pause, reset, continueGame }
}