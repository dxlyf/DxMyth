type CallbacksOptions = {
    once?: boolean;
    memory?: boolean;
    unique?: boolean;
    stopOnFalse?: boolean;
};
type ListHandle<Args extends any[] = any> = (...args: Args) => any;
export declare class Callbacks<Args extends any[] = any, Context extends any = any> {
    firing: boolean;
    memory: any;
    fired: boolean;
    locked: boolean;
    list: ListHandle<Args>[];
    queue: any[];
    firingIndex: number;
    destroyedList: boolean;
    options: Required<CallbacksOptions>;
    constructor(options?: CallbacksOptions);
    private _fire;
    add(...args: (ListHandle<Args> | ListHandle<Args>[])[]): this;
    remove(...args: ListHandle[]): this;
    has(fn: ListHandle): boolean;
    empty(): this;
    disable(): this;
    disabled(): boolean;
    lock(): this;
    fireWith(context: Context, args: Args): this;
    fire(...args: Args): this;
}
export {};
