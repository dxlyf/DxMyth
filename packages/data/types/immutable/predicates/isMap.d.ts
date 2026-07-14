import { Map } from '../../type-definitions/immutable';
export declare const IS_MAP_SYMBOL = "@@__IMMUTABLE_MAP__@@";
/**
 * True if `maybeMap` is a Map.
 *
 * Also true for OrderedMaps.
 */
export declare function isMap(maybeMap: unknown): maybeMap is Map<unknown, unknown>;
