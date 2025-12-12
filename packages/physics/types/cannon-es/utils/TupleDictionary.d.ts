/**
 * TupleDictionary
 */
export declare class TupleDictionary {
    data: {
        [id: string]: any;
        keys: string[];
    };
    /** get */
    get(i: number, j: number): any;
    /** set */
    set(i: number, j: number, value: any): void;
    /** delete */
    delete(i: number, j: number): void;
    /** reset */
    reset(): void;
}
