import { get } from "svelte/store";
import createKeyboardListener from "../keyboard/createKeyboardListener";
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
    const activeKeys: Keys = {};
    const movesAccepted: Moves = {};

    const subscribeMoves = () => {
        const { ships } = get(stateGame);
        const [ship] = ships;

        movesAccepted[forwardKey] = () => {
            ship.movingForward = activeKeys[forwardKey];
        };
        movesAccepted[leftKey] = () => {
            ship.rotate({ left: true });
        }
        movesAccepted[rightKey] = () => {
            ship.rotate({ right: true });
        }

        movesAccepted[shootKey] = () => {
            if (activeKeys[shootKey])
                ship.shoot();
            else
                ship.stopShoot();
        }

        addEvents(handleKeydown, handleKeyup);
    }

    const unSubscribeMoves = () => {
        const { ships } = get(stateGame);
        const [ship] = ships;

        ship.movingForward = false;

        activeKeys[forwardKey] = false
        activeKeys[leftKey] = false;
        activeKeys[rightKey] = false;
        activeKeys[shootKey] = false;

        if (ship.fireInterval)
            ship.stopShoot();

        removeEvents();
    }

    const handleKeydown = (key: string) => {
        if (forwardKey !== key && leftKey !== key && rightKey !== key && shootKey !== key) return;

        activeKeys[key] = true;

        movesAccepted[key]()

    }
    const handleKeyup = (key: string) => {
        if (forwardKey !== key && leftKey !== key && rightKey !== key && shootKey !== key) return;

        activeKeys[key] = false;

        if (key === forwardKey || key === shootKey)
            movesAccepted[key]();

    }

    return {
        unSubscribeMoves,
        subscribeMoves
    }
}