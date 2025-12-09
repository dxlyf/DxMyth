export declare class OverlapKeeper {
    current: number[];
    previous: number[];
    /**
     * @todo Remove useless constructor
     */
    constructor();
    /**
     * getKey
     */
    getKey(i: number, j: number): number;
    /**
     * set
     */
    set(i: number, j: number): void;
    /**
     * tick
     */
    tick(): void;
    /**
     * getDiff
     */
    getDiff(additions: number[], removals: number[]): void;
}
