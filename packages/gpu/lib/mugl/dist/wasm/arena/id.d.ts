/**
 * Generational index ID, which consists of an index and a generation values combined as a single number.
 * @packageDocumentation
 */
export declare const MAX_SAFE_GENERATION: number;
export declare const UNIT_GENERATION: number;
/** Creates a generational index ID from index and generation parts. */
export declare function create<T extends number = number>(index: number, generation: number): T;
/** Returns the index part (lower 32bit) of a generational index ID. */
export declare function indexOf<T extends number = number>(id: T): number;
/** Returns the generation part (upper 21bit) of a generational index ID. */
export declare function generationOf<T extends number = number>(id: T): number;
//# sourceMappingURL=id.d.ts.map