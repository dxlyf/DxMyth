function merge(target, ...sources) {
  for (const source of sources) {
    deepMerge(target, source);
  }
  return target;
}
function deepMerge(target, source) {
  if (source == null || typeof source !== "object") {
    return target;
  }
  for (const key of Object.keys(source)) {
    const val = source[key];
    const targetVal = target[key];
    if (Array.isArray(targetVal) && Array.isArray(val)) {
      target[key] = deepMerge(targetVal, val);
    }
    if (isPlainObject(targetVal) && isPlainObject(val)) {
      target[key] = deepMerge(targetVal, val);
    } else if (Array.isArray(val)) {
      target[key] = deepMerge([], val);
    } else if (isPlainObject(val)) {
      target[key] = deepMerge({}, val);
    } else if (val !== void 0) {
      target[key] = val;
    }
  }
  return target;
}
function isPrimitive(value) {
  const type = typeof value;
  return value !== null && (type !== "object" && type !== "undefined");
}
function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}
export {
  isPrimitive,
  merge
};
