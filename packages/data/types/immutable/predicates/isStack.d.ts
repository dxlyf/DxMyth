import { Stack } from '../../type-definitions/immutable';
export declare const IS_STACK_SYMBOL = "@@__IMMUTABLE_STACK__@@";
/**
 * True if `maybeStack` is a Stack.
 */
export declare function isStack(maybeStack: unknown): maybeStack is Stack<unknown>;
