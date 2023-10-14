type Timers = {
    [key: string]: NodeJS.Timeout | undefined
}

export default function createKeyboardListener() {
    function addEvents(handleKeydown: (key: string) => void, handleKeyup: (key: string) => void) {
        const timers: Timers = {};

        document.onkeydown = (e: KeyboardEvent) => {
            const key = e.key.trim() ? e.key : e.code;

            if (!(key in timers)) {
                timers[key] = undefined;
                timers[key] = setInterval(() => handleKeydown(key), 25);
            }

            handleKeydown(key);
        }
        document.onkeyup = (e: KeyboardEvent) => {
            const key = e.key.trim() ? e.key : e.code;

            if (key in timers) {
                if (timers[key] !== null)
                    clearInterval(timers[key]);
                delete timers[key];
            }

            handleKeyup(key);
        }

    }
    function removeEvents() {
        document.onkeydown = () => {
            return;
        };
        document.onkeyup = () => {
            return;
        };
    };

    return {
        addEvents,
        removeEvents
    }
}