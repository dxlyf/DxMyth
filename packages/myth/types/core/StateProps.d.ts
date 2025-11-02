import { StatePropOptions, IStateProp } from '../../../../../../../../src/types/core/StateProps.ts';
export declare class StateProp<T, Context = any> implements IStateProp<T, Context> {
    name: string;
    current: T;
    options: StatePropOptions<T, Context>;
    context: Context;
    constructor(context: Context, options: StatePropOptions<T, Context>);
    getDefault(): T;
    equals(a: T, b: T): boolean;
    shouldUpdate(a: T, b: T): boolean;
    get(): T;
    set(value: T): boolean;
}
export type StatePropsOptions<T extends Record<string, unknown>, Context> = {
    [P in keyof T]: StatePropOptions<T[P], Context>;
};
type IStateProps<T extends Record<string, unknown>, Context> = {
    [Key in keyof T]: StateProp<T[Key], Context>;
};
export declare function createStateProps<T extends Record<string, unknown>, Context = any>(context: Context, options: StatePropsOptions<T, Context>): IStateProps<T, Context>;
export {};
