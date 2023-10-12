export default function createKeyboardListener() {
    function addEvents(handleKeydown: (key: string) => void, handleKeyup: (key: string) => void) {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            const key = e.key.trim() ? e.key : e.code;
            
            handleKeydown(key);
        })
        document.addEventListener('keyup', (e: KeyboardEvent) => {
            const key = e.key.trim() ? e.key : e.code;
            
            handleKeyup(key);
        })
    }

    function removeEvents() {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        document.removeEventListener('keydown', () => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        document.removeEventListener('keyup', () => {});
    }

    return {
        addEvents,
        removeEvents
    }
}