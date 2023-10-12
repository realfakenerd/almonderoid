import type { Asteroid, Bullet } from "$lib/objects";
import { canvasStore as Canvas, ctxStore as Ctx, renderLoopId, stateGame } from "$lib/stores";
import { get } from "svelte/store";

function drawObjects(objects: (Bullet | Asteroid)[]) {
    for (const obj of objects) {
        obj.update();
        obj.draw();
    }
}

export default function renderGame() {
    const { ships, asteroids, bullets } = get(stateGame);
    const canvas = get(Canvas)
    const ctx = get(Ctx)

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (ships.length > 0) {
        for (const ship of ships) {
            ship.update();
            ship.draw();
        }
    }

    if (asteroids.length > 0) {
        drawObjects(asteroids)
    }

    if (bullets.length > 0) {
        drawObjects(bullets)
    }

    renderLoopId.set(requestAnimationFrame(renderGame));
}