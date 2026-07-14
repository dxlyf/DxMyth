import { Collection, Record } from '../../type-definitions/immutable';
/**
 * Returns true if the value is a potentially-persistent data structure, either
 * provided by Immutable.js or a plain Array or Object.
 */
export default function isDataStructure(value: unknown): value is Collection<unknown, unknown> | Record<object> | Array<unknown> | object;
