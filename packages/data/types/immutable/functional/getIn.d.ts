import { KeyPath } from '../../type-definitions/immutable';
import { get } from './get';
type GetType = typeof get;
type GetTypeParameters = Parameters<GetType>;
type CollectionType = GetTypeParameters[0];
type Key = GetTypeParameters[1];
/**
 * Returns the value at the provided key path starting at the provided
 * collection, or notSetValue if the key path is not defined.
 *
 * A functional alternative to `collection.getIn(keypath)` which will also
 * work with plain Objects and Arrays.
 */
export declare function getIn(collection: CollectionType, searchKeyPath: KeyPath<Key>, notSetValue?: GetTypeParameters[2]): ReturnType<GetType>;
export {};
