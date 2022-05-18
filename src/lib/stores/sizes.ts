import {readable} from 'svelte/store';

const canvasWidth = readable(window.innerWidth / 2);
const canvasHeight = readable(window.innerHeight / 2);

export {
    canvasWidth,
    canvasHeight
}