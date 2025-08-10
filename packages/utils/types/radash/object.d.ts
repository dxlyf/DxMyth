type LowercasedKeys<T extends Record<string, any>> = {
    [P in keyof T & string as Lowercase<P>]: T[P];
};
type UppercasedKeys<T extends Record<string, any>> = {
    [P in keyof T & string as Uppercase<P>]: T[P];
};
/**
 * Removes (shakes out) undefined entries from an
 * object. Optional second argument shakes out values
 * by custom evaluation.
 */
export declare const shake: <RemovedKeys extends string, T>(obj: T, filter?: (value: any) => boolean) => Omit<T, RemovedKeys>;
/**
 * Map over all the keys of an object to return
 * a new object
 */
export declare const mapKeys: <TValue, TKey extends string | number | symbol, TNewKey extends string | number | symbol>(obj: Record<TKey, TValue>, mapFunc: (key: TKey, value: TValue) => TNewKey) => Record<TNewKey, TValue>;
/**
 * Map over all the keys to create a new object
 */
export declare const mapValues: <TValue, TKey extends string | number | symbol, TNewValue>(obj: Record<TKey, TValue>, mapFunc: (value: TValue, key: TKey) => TNewValue) => Record<TKey, TNewValue>;
/**
 * Map over all the keys to create a new object
 */
export declare const mapEntries: <TKey extends string | number | symbol, TValue, TNewKey extends string | number | symbol, TNewValue>(obj: Record<TKey, TValue>, toEntry: (key: TKey, value: TValue) => [TNewKey, TNewValue]) => Record<TNewKey, TNewValue>;
/**
 * Returns an object with { [keys]: value }
 * inverted as { [value]: key }
 */
export declare const invert: <TKey extends string | number | symbol, TValue extends string | number | symbol>(obj: Record<TKey, TValue>) => Record<TValue, TKey>;
/**
 * Convert all keys in an object to lower case
 */
export declare const lowerize: <T extends Record<string, any>>(obj: T) => LowercasedKeys<T>;
/**
 * Convert all keys in an object to upper case
 */
export declare const upperize: <T extends Record<string, any>>(obj: T) => UppercasedKeys<T>;
/**
 * Creates a shallow copy of the given obejct/value.
 * @param {*} obj value to clone
 * @returns {*} shallow clone of the given value
 */
export declare const clone: <T>(obj: T) => T;
/**
 * Convert an object to a list, mapping each entry
 * into a list item
 */
export declare const listify: <TValue, TKey extends string | number | symbol, KResult>(obj: Record<TKey, TValue>, toItem: (key: TKey, value: TValue) => KResult) => KResult[];
/**
 * Pick a list of properties from an object
 * into a new object
 */
export declare const pick: <T extends object, TKeys extends keyof T>(obj: T, keys: TKeys[]) => Pick<T, TKeys>;
/**
 * Omit a list of properties from an object
 * returning a new object with the properties
 * that remain
 */
export declare const omit: <T, TKeys extends keyof T>(obj: T, keys: TKeys[]) => Omit<T, TKeys>;
/**
 * Dynamically get a nested value from an array or
 * object with a string.
 *
 * @example get(person, 'friends[0].name')
 */
export declare const get: <TDefault = unknown>(value: any, path: string, defaultValue?: TDefault) => TDefault;
/**
 * Opposite of get, dynamically set a nested value into
 * an object using a key path. Does not modify the given
 * initial object.
 *
 * @example
 * set({}, 'name', 'ra') // => { name: 'ra' }
 * set({}, 'cards[0].value', 2) // => { cards: [{ value: 2 }] }
 */
export declare const set: <T extends object, K>(initial: T, path: string, value: K) => T;
/**
 * Merges two objects together recursivly into a new
 * object applying values from right to left.
 * Recursion only applies to child object properties.
 */
export declare const assign: <X extends Record<string | symbol | number, any>>(initial: X, override: X) => X;
/**
 * Get a string list of all key names that exist in
 * an object (deep).
 *
 * @example
 * keys({ name: 'ra' }) // ['name']
 * keys({ name: 'ra', children: [{ name: 'hathor' }] }) // ['name', 'children.0.name']
 */
export declare const keys: <TValue extends object>(value: TValue) => string[];
/**
 * Flattens a deep object to a single demension, converting
 * the keys to dot notation.
 *
 * @example
 * crush({ name: 'ra', children: [{ name: 'hathor' }] })
 * // { name: 'ra', 'children.0.name': 'hathor' }
 */
export declare const crush: <TValue extends object>(value: TValue) => object;
/**
 * The opposite of crush, given an object that was
 * crushed into key paths and values will return
 * the original object reconstructed.
 *
 * @example
 * construct({ name: 'ra', 'children.0.name': 'hathor' })
 * // { name: 'ra', children: [{ name: 'hathor' }] }
 */
export declare const construct: <TObject extends object>(obj: TObject) => object;
export {};
