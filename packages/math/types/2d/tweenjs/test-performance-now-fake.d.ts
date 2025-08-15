/**
 * @fileoverview Tool for patching performance.now so we can fake it in the
 * tests.
 */
export declare function tickTime(t: number): void;
export declare function patchPerformanceNow(): void;
export declare function restorePerformanceNow(): void;
