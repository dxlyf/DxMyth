import { Set } from '../../type-definitions/immutable';
export declare const IS_SET_SYMBOL = "@@__IMMUTABLE_SET__@@";
/**
 * True if `maybeSet` is a Set.
 *
 * Also true for OrderedSets.
 */
export declare function isSet(maybeSet: unknown): maybeSet is Set<unknown>;
