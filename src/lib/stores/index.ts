import { writable } from 'svelte/store';
import { writable as ls } from 'svelte-local-storage-store';
import type { Asteroid, Bullet, Ship } from '$lib/objects';

export interface KeysDef {
	forwardKey: string;
	leftKey: string;
	rightKey: string;
	shootKey: string;
}

export interface StateGame {
	ships: Ship[];
	asteroids: Asteroid[];
	bullets: Bullet[]
}

export const stateGame = writable<StateGame>({
	ships: [],
	asteroids: [],
	bullets: []
});
export const nameAcronym = writable('');
export const lives = writable(0);
export const isGameOver = writable(false);
export const isGameStarted = writable(false);
export const renderLoopId = writable<number>();

export const score = writable(0);
export const highScore = ls('highscore', 0);

export const keyStore = ls<KeysDef>('settings', {
	forwardKey: 'w',
	leftKey: 'a',
	rightKey: 'd',
	shootKey: 'Space'
});

export const canvasStore = writable<HTMLCanvasElement>();
export const ctxStore = writable<CanvasRenderingContext2D>();