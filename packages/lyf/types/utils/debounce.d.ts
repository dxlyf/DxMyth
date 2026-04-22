export declare function debounce<T extends (...args: any) => any>(fn: T, delay: number): (this: any, ...args: Parameters<T>) => void;
