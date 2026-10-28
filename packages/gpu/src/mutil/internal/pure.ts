/**
 * Pure numeric helpers. These are implementation details only — they do not
 * describe any renderer resource, so they are safe to share between the
 * otherwise fully independent backends.
 */

/** FNV-1a 32 bit string hash. Stable and fast for cache keys. */
export function hashFNV1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Smallest power of two >= value (minimum 1). */
export function nextPowerOfTwo(value: number): number {
  if (!Number.isFinite(value) || value <= 1) return 1;
  let p = 1;
  while (p < value) p *= 2;
  return p;
}

/** Round `value` up to the next multiple of `alignment` (alignment > 0). */
export function alignTo(value: number, alignment: number): number {
  return Math.ceil(value / alignment) * alignment;
}

/** Element-wise numeric comparison of two array-likes. */
export function numbersEqual(a: ArrayLike<number>, b: ArrayLike<number>): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/** Copy an array-like into a plain number[] (used for uniform value caching). */
export function toNumberArray(values: ArrayLike<number>): number[] {
  const out = new Array<number>(values.length);
  for (let i = 0; i < values.length; i++) out[i] = values[i]!;
  return out;
}
