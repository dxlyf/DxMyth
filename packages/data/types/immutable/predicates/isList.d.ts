import { List } from '../../type-definitions/immutable';
export declare const IS_LIST_SYMBOL = "@@__IMMUTABLE_LIST__@@";
/**
 * True if `maybeList` is a List.
 */
export declare function isList(maybeList: unknown): maybeList is List<unknown>;
