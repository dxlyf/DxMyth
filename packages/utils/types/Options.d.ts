export type OptionConfig<Context, Value> = {
    overrideMethods?: Partial<IOption<Context, Value>>;
    init?(this: IOption<Context, Value>): void;
    default: Value | ((ctx: Context) => Value);
    set?(this: IOption<Context, Value>, v: Value, ctx: Context): void;
    equal?(a: Value, b: Value): boolean;
    dispose?(this: IOption<Context, Value>): void;
    [key: string]: any;
};
export interface IOption<Context, Value> {
    name: string;
    fields?: {
        [key: string]: any;
    };
    parent: Options<Context, any>;
    context: Context;
    current: Value;
    dirty: boolean;
    options: OptionConfig<Context, Value>;
    equal(a: Value, b: Value): boolean;
    default(): Value;
    reset(): void;
    set(v: Value): boolean;
    get(): Value;
    dispose(): void;
}
export declare class Option<Context, Value> implements IOption<Context, Value> {
    name: string;
    fields?: {
        [key: string]: any;
    };
    parent: Options<Context, any>;
    context: Context;
    options: OptionConfig<Context, Value>;
    current: Value;
    dirty: boolean;
    constructor(context: Context, options: OptionConfig<Context, Value>);
    equal(a: Value, b: Value): boolean;
    default(): Value;
    reset(): void;
    shouldUpdate(v: Value): boolean;
    set(v: Value): boolean;
    get(): Value;
    dispose(): void;
}
export type OptionsProperties<Context, Props> = {
    [key in keyof Props]: OptionConfig<Context, Props[key]>;
};
export type OptionsPropertiesInstance<Context, Props> = {
    [key in keyof Props]: IOption<Context, Props[key]>;
};
type OptionMap<Context, Props extends {}> = Map<keyof Props, IOption<Context, Props[keyof Props]>>;
type OptionConstructor<Context, Props extends {}> = typeof Option<Context, Props[keyof Props]>;
type OptionClassMap<Context, Props extends {}> = Map<keyof Props, OptionConstructor<Context, Props>>;
export type OptionsInstance<Context, Props extends {}> = Options<Context, Props> & OptionsPropertiesInstance<Context, Props>;
export declare class Options<Context, Props extends {}> {
    static create<Context, Props extends {}>(context: Context, props: OptionsProperties<Context, Props>): OptionsInstance<Context, Props>;
    context: Context;
    options: OptionMap<Context, Props>;
    optionClass: OptionClassMap<Context, Props>;
    constructor(context: Context, props?: OptionsProperties<Context, Props>);
    register<K extends keyof Props>(name: K, optionClass: OptionConstructor<Context, Props>): void;
    private defineGetter;
    initOptions(props: OptionsProperties<Context, Props>): void;
    getOption<K extends keyof Props>(key: K): IOption<Context, Props[K]>;
    removeOption(key: keyof Props): void;
    addOptionFromInstance(key: keyof Props, option: IOption<Context, Props[keyof Props]>): void;
    addOptionFromConfig(key: keyof Props, option: OptionConfig<Context, Props[Extract<keyof Props, string>]>): void;
}
export {};
