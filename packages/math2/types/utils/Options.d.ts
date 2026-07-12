export type OptionProps<Context, Value, Parameters = Value> = {
    default?(ctx: Context): Value;
    update?(ctx: Context, current: Value, prev: Value): boolean;
    map?(ctx: Context, value: Parameters): Value;
    equals?(ctx: Context, current: Value, prev: Value): boolean;
};
export declare class Option<Context, Value, Parameters = Value> {
    ctx: Context;
    private current;
    options: OptionProps<Context, Value, Parameters>;
    dirty: boolean;
    version: number;
    constructor(context: Context, options: OptionProps<Context, Value, Parameters>);
    default(): void;
    markDrity(): void;
    refresh(): void;
    get(): Value;
    map(value: Parameters): Value;
    equals(current: Value, prev: Value): boolean;
    update(value: Value, forceUpdate?: boolean): boolean;
    set(param: Parameters): boolean;
    copy(source: Option<Context, Value, Parameters>): this;
    clone(): Option<Context, Value, Parameters>;
}
