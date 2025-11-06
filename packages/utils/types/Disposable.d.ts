export interface IDisposable {
    isDisposed(): boolean;
    dispose(): void;
    disposeLater(): void;
}
type DPRegisterOptions = {
    dispose?: () => void;
};
export declare const addDisposable: (target: IDisposable) => void;
export declare class DisposableManager {
    static add: (target: IDisposable) => void;
    static mixin(target: any, options?: DPRegisterOptions): void;
    private disposables;
    private persistentDisposables;
    add(disposable: IDisposable): void;
    addPersistent(disposable: IDisposable): void;
    destroy(): void;
    dispose(): void;
    run(fn: () => void): void;
}
export {};
