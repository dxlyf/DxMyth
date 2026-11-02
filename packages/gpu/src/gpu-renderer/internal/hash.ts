/** FNV-1a (32 bit), stable across runs and platforms. */
export function hashString(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);
  if (value !== null && typeof value === 'object') {
    const source = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(source).sort()) {
      out[key] = normalize(source[key]);
    }
    return out;
  }
  if (typeof value === 'number' && Number.isNaN(value)) return 'NaN';
  return value;
}

/** Deterministic serialization: object keys sorted recursively. */
export function stableSerialize(value: unknown): string {
  return JSON.stringify(normalize(value));
}
