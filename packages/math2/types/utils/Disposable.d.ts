export interface IDestroyable {
    isDestroyed: boolean;
    destroy(): void;
}
export interface IDisposable {
    isDisposed: boolean;
    dispose(): void;
}
export interface IDisposableLater extends IDisposable {
    disposeLater(): void;
}
type DPRegisterOptions<T> = {
    dispose?: (obj: T) => void;
};
export declare const pushDisposableManager: (manager: DisposableManager) => DisposableManager;
export declare const popDisposableManager: () => void;
export declare const addDisposable: (target: IDisposable) => void;
export declare class DisposableManager {
    static add: (target: IDisposable) => void;
    static mixin<T>(target: {
        new (...args: any[]): T;
    }, options?: DPRegisterOptions<T>): void;
    private disposables;
    private persistentDisposables;
    add(disposable: IDisposable): void;
    addPersistent(disposable: IDisposable): void;
    destroy(): void;
    dispose(): void;
    run(fn: () => void): void;
}
export {};
