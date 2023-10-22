export type RenderGame = {
    (): void;
    stopRender: (clear?: boolean) => void;
}