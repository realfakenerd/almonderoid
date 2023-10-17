interface Timers {
    [key: string]: NodeJS.Timeout | undefined
};

export default function createKeyboardListener() {
    const timers: Timers = {};

    function addEvents(handleKeydown: (key: string) => void, handleKeyup: (key: string) => void) {
        document.onkeydown = (e: KeyboardEvent) => {
            const key = e.key.trim() ? e.key : e.code;

            if (!(key in timers)) {
                timers[key] = undefined;

                handleKeydown(key);
                timers[key] = setInterval(() => handleKeydown(key), 10);
            }

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
        for (const time in timers) {
            clearInterval(timers[time]);
            
            delete timers[time];
        }

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