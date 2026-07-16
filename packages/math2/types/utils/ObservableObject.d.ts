type ChangeCallbackParamter = {
    path: string;
    parent: string;
    field: string;
    newValue: any;
    oldValue: any;
};
type ChangeCallback = (change: ChangeCallbackParamter) => void;
export declare class ObservableObject {
    private proxy;
    private listeners;
    private rawToProxy;
    private proxyToRaw;
    constructor(target: object);
    get value(): any;
    subscribe(callback: ChangeCallback): () => void;
    private notify;
    private createProxy;
}
export {};
