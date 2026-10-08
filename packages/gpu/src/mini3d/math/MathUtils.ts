/**
 * Shared floating point helpers. Kept free of DOM/GPU imports so the math layer
 * can be unit tested in plain Node.
 */

/** Tolerance used by `equals`-style comparisons throughout the math library. */
export const EPSILON = 1e-6;

export const DEG2RAD = Math.PI / 180;
export const RAD2DEG = 180 / Math.PI;

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Inverse lerp; returns 0 when the range is degenerate. */
export function inverseLerp(a: number, b: number, value: number): number {
  return a === b ? 0 : (value - a) / (b - a);
}

export function smoothstep(min: number, max: number, value: number): number {
  const t = clamp(inverseLerp(min, max, value), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Powers of two helper used by mipmap / max-texture-size math. */
export function floorPowerOfTwo(value: number): number {
  return 2 ** Math.floor(Math.log2(value));
}

export function ceilPowerOfTwo(value: number): number {
  return 2 ** Math.ceil(Math.log2(value));
}

/** True when `value` is (close to) a power of two. */
export function isPowerOfTwo(value: number): boolean {
  return (value & (value - 1)) === 0 && value !== 0;
}

/**
 * Deterministic pseudo random generator (mulberry32). Used by geometry helpers
 * that need repeatable scattering without pulling in a dependency.
 */
export function createRandom(seed = 1): () => number {
  let a = seed >>> 0;
  return function random(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
