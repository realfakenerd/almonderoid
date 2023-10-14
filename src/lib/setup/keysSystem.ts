import { get } from "svelte/store";
import createKeyboardListener from "./createKeyboardListener";
import { ctxStore, keyStore, stateGame } from "$lib/stores";
import { Bullet } from "$lib/objects";

type Keys = {
    [key: string]: boolean;
}

type Moves = {
    [key: string]: () => void
}

export default function keysSystem() {
    const ctx = get(ctxStore);
    const { addEvents, removeEvents } = createKeyboardListener();
    const { forwardKey, leftKey, rightKey, shootKey } = get(keyStore);
    const keys: Keys = {};
    const moves: Moves = {};

    const subscribeMoves = () => {
        addEvents(handleKeydown, handleKeyup);

        const { ships } = get(stateGame);
        const ship = ships[0];

        moves[forwardKey] = () => {
            ship.movingForward = keys[forwardKey];
        };
        moves[leftKey] = () => {
            ship.rotate(-1);
        }
        moves[rightKey] = () => {
            ship.rotate(1);
        }
        moves[shootKey] = () => {
            stateGame.update(val => ({
                ...val,
                bullets: [new Bullet(ship.angle, ctx, ship), ...val.bullets]
            }))
        }

    }

    const handleKeydown = (key: string) => {
        if (forwardKey !== key && leftKey !== key && rightKey !== key && shootKey !== key) return;

        keys[key] = true;

        if (keys[forwardKey]) moves[forwardKey]();
        if (keys[leftKey]) moves[leftKey]();
        if (keys[rightKey]) moves[rightKey]();
        if (keys[shootKey]) moves[shootKey]();
    }
    const handleKeyup = (key: string) => {
        if (forwardKey !== key && leftKey !== key && rightKey !== key && shootKey !== key) return;

        keys[key] = false;
        if (key === forwardKey)
            moves[key]();
    }

    return {
        unSubscribeMoves: removeEvents,
        subscribeMoves
    }
}