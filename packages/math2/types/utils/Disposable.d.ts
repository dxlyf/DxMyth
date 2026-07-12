interface IDispose {
    isDisposed: boolean;
    dispose: () => void;
}
export interface IDisposable extends IDispose {
    disposeLater(): void;
}
type DPRegisterOptions<T> = {
    dispose?: (obj: T) => void;
};
export declare const addDisposable: (target: IDispose) => void;
export declare class DisposableManager {
    static add: (target: IDispose) => void;
    static mixin<T>(target: {
        new (...args: any[]): T;
    }, options?: DPRegisterOptions<T>): void;
    private disposables;
    private persistentDisposables;
    add(disposable: IDispose): void;
    addPersistent(disposable: IDispose): void;
    destroy(): void;
    dispose(): void;
    run(fn: () => void): void;
}
export {};
