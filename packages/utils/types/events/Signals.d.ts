type HandleContext = {
    stop: () => void;
    remove: () => void;
};
type Handle<T extends any[]> = (...args: [...T, context: HandleContext]) => void;
type Options = {
    stage?: number;
    once?: boolean;
};
type Unsubscribe = () => void;
interface Signals<T extends any[]> {
    add(handle: Handle<T>, options?: Options): Unsubscribe;
    remove(handle: Handle<T>): void;
    dispatch(...args: T): void;
    clear(): void;
}
export declare function Signals<T extends any[]>(): Signals<T>;
export {};
