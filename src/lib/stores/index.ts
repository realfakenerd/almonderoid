import { writable } from 'svelte/store';
import { writable as ls } from 'svelte-local-storage-store';
import type { Asteroid, Ship } from '$lib/objects';

export interface KeysDef {
	forwardKey: string;
	leftKey: string;
	rightKey: string;
	shootKey: string;
}

export interface StateGame {
	ships: Ship[];
	asteroids: Asteroid[];
}

export const stateGame = writable<StateGame>({
	ships: [],
	asteroids: []
});
export const nameAcronym = writable('');
export const lives = writable(0);
export const isGameOver = writable(false);
export const isGameStarted = writable(false);
export const isGamePaused = writable(false);
export const renderLoopId = writable<number>();
export const sensibilityMoves = writable<number>();
export const sensibilityShoots = writable<number>();

export const score = writable(0);
export const highScore = ls('highscore', 0);

export const keyStore = ls<KeysDef>('settings', {
	forwardKey: 'ArrowUp',
	leftKey: 'ArrowLeft',
	rightKey: 'ArrowRight',
	shootKey: 's'
});

export const canvasStore = writable<HTMLCanvasElement>();
export const ctxStore = writable<CanvasRenderingContext2D>();