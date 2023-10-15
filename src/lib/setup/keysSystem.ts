import { get } from "svelte/store";
import createKeyboardListener from "./createKeyboardListener";
import { keyStore, stateGame } from "$lib/stores";

type Keys = {
    [key: string]: boolean;
}

type Moves = {
    [key: string]: () => void
}

export default function keysSystem() {
    const { addEvents, removeEvents } = createKeyboardListener();
    const { forwardKey, leftKey, rightKey, shootKey } = get(keyStore);
    const keys: Keys = {};
    const moves: Moves = {};

    const subscribeMoves = () => {
        const { ships } = get(stateGame);
        const ship = ships[0];

        moves[forwardKey] = () => {
            ship.movingForward = keys[forwardKey];
        };
        moves[leftKey] = () => {
            ship.rotate({left: true});
        }
        moves[rightKey] = () => {
            ship.rotate({right: true});
        }

        moves[shootKey] = () => {
            if (keys[shootKey])
                ship.shoot();
            else
                ship.stopShoot();
        }

        addEvents(handleKeydown, handleKeyup);
    }

    const unSubscribeMoves = () => {
        const { ships } = get(stateGame);
        const ship = ships[0];

        if (ship.fireInterval)
            ship.stopShoot();
        
        removeEvents();
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

        if (key === forwardKey || key === shootKey)
            moves[key]();

    }

    return {
        unSubscribeMoves,
        subscribeMoves
    }
}