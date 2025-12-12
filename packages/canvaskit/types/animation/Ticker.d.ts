type TickHandle = (dt: number) => void;
export declare class Ticker {
    static instance: Ticker | null;
    static getInstance(): Ticker;
    private runing;
    private callbacks;
    private animationFrameId;
    delta: number;
    start(): void;
    stop(): void;
    add(cb: TickHandle): void;
    remove(cb: TickHandle): void;
    clear(): void;
}
export {};
