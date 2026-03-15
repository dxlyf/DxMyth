
/**
 * @param {array} arr an "accumulation" of items which is either an Array or
 * a single item. Useful when paired with the `accumulate` module. This is a
 * simple utility that allows us to reason about a collection of items, but
 * handling the case when there is exactly one item (and we do not need to
 * allocate an array).
 * @param {function} cb Callback invoked with each element or a collection.
 * @param {?} [scope] Scope used as `this` in a callback.
 */
function forEachAccumulated<T>(
  arr: (Array<T> | T),
  cb: (elem: T) => void,
  scope?:any,
) {
  if (Array.isArray(arr)) {
    arr.forEach(cb, scope);
  } else if (arr) {
    cb.call(scope, arr);
  }
}

export default forEachAccumulated;
