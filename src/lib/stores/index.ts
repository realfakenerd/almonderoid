import { writable } from 'svelte/store';
import { writable as ls } from 'svelte-local-storage-store';

interface KeysDef {
	forwardKey: string;
	leftKey: string;
	rightKey: string;
	shootKey: string;
}

export const lives = writable(999);
export const isGameOver = writable(false);
export const isGameStarted = writable(false);

export const score = writable(0);
export const highScore = ls('highscore', 0);

export const keyStore = ls<KeysDef>('settings', {
	forwardKey: '',
	leftKey: '',
	rightKey: '',
	shootKey: ''
});
