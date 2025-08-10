/**
 * Generates a random number between min and max
 */
export declare const random: (min: number, max: number) => number;
/**
 * Draw a random item from a list. Returns
 * null if the list is empty
 */
export declare const draw: <T>(array: readonly T[]) => T | null;
export declare const shuffle: <T>(array: readonly T[]) => T[];
export declare const uid: (length: number, specials?: string) => string;
