import { writable } from 'svelte/store';
import { writable as ls } from 'svelte-local-storage-store';
import type { Asteroid, Ship } from '$lib/objects';
import type { Point } from '$lib/objects/Point';

export interface KeysDef {
	forwardKey: string;
	leftKey: string;
	rightKey: string;
	shootKey: string;
}

export interface StateGame {
	ships: Ship[];
	asteroids: Asteroid[];
	points: Point[];
}

export const stateGame = writable<StateGame>({
	ships: [],
	asteroids: [],
	points: []
});
export const nameAcronym = writable('');
export const lives = writable(3);
export const isGameOver = writable(false);
export const isGameStarted = writable(false);
export const isGamePaused = writable(false);

export const score = writable(0);
export const highScore = ls('highscore', 0);

const arrowKeys = {
	forwardKey: 'ArrowUp',
	leftKey: 'ArrowLeft',
	rightKey: 'ArrowRight',
	shootKey: 's'
}

const lettersKeys = {
	forwardKey: 'w',
	leftKey: 'a',
	rightKey: 'd',
	shootKey: 'Space'
}
export const keyStore = ls<KeysDef>('settings', lettersKeys);

export const canvasStore = writable<HTMLCanvasElement>();
export const ctxStore = writable<CanvasRenderingContext2D>();