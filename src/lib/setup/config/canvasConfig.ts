import { canvasStore, ctxStore } from "$lib/stores";

export default function canvasConfig(document: Document) {
    const canvas = document.getElementById('game') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvasStore.set(canvas);
    ctxStore.set(ctx);

    return {
        canvas,
        ctx
    }
}
