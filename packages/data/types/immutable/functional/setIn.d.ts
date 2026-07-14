import { KeyPath } from '../../type-definitions/immutable';
import { PossibleCollection } from './updateIn';
/**
 * Returns a copy of the collection with the value at the key path set to the
 * provided value.
 *
 * A functional alternative to `collection.setIn(keypath)` which will also
 * work with plain Objects and Arrays.
 */
export declare function setIn<K extends PropertyKey, V, TProps extends object, C extends PossibleCollection<K, V, TProps>>(collection: C, keyPath: KeyPath<K>, value: unknown): C;
