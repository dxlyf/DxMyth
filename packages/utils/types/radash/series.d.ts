/**
 * Creates a series object around a list of values
 * that should be treated with order.
 */
export declare const series: <T>(items: T[], toKey?: (item: T) => string | symbol) => {
    min: (a: T, b: T) => T;
    max: (a: T, b: T) => T;
    first: () => T;
    last: () => T;
    next: (current: T, defaultValue?: T) => T;
    previous: (current: T, defaultValue?: T) => T;
    spin: (current: T, num: number) => T;
};
