/**
 * Stable identity and key derivation for WebGPU descriptors.
 *
 * Descriptor objects are hashed by content; GPU resource objects (buffers,
 * textures, views, samplers, pipelines) are hashed by identity. This lets the
 * caches recognise logically identical requests across frames.
 */

const objectIds = new WeakMap<object, number>();
let nextObjectId = 1;

export function objectId(value: object): number {
  let id = objectIds.get(value);
  if (id === undefined) {
    id = nextObjectId++;
    objectIds.set(value, id);
  }
  return id;
}

function isPlainObject(value: object): boolean {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function serialize(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'u';
  const type = typeof value;
  if (type === 'string') return JSON.stringify(value);
  if (type === 'number' || type === 'boolean' || type === 'bigint') return String(value);
  if (type === 'function') return 'fn';
  if (Array.isArray(value)) return `[${value.map((item) => serialize(item)).join(',')}]`;
  const object = value as object;
  if (isPlainObject(object)) {
    const record = object as Record<string, unknown>;
    const keys = Object.keys(record).sort();
    const parts: string[] = [];
    for (const key of keys) {
      const item = record[key];
      if (item === undefined || typeof item === 'function') continue;
      parts.push(`${JSON.stringify(key)}:${serialize(item)}`);
    }
    return `{${parts.join(',')}}`;
  }
  return `#${objectId(object)}`;
}

/** Deterministic content key for plain descriptor data, identity for GPU objects. */
export function stableKey(value: unknown): string {
  return serialize(value);
}

/** Unwraps multi-render wrappers that expose a `.handle`. */
export function unwrapHandle<T>(value: T): T {
  if (value && typeof value === 'object' && 'handle' in (value as object)) {
    const handle = (value as unknown as { handle: unknown }).handle;
    if (handle) return handle as T;
  }
  return value;
}

/** Key describing one bind group entry, independent of entry order. */
export function bindGroupEntriesKey(entries: readonly { binding: number; resource: unknown }[]): string {
  const parts: string[] = [];
  for (const entry of entries) {
    const resource = entry.resource as Record<string, unknown> | null;
    if (resource && typeof resource === 'object' && 'buffer' in resource) {
      const buffer = unwrapHandle(resource.buffer as object);
      const offset = typeof resource.offset === 'number' ? resource.offset : 0;
      const size = typeof resource.size === 'number' ? resource.size : 0;
      parts.push(`${entry.binding}|b${objectId(buffer)}|${offset}|${size}`);
    } else {
      parts.push(`${entry.binding}|r${objectId(unwrapHandle(resource as object))}`);
    }
  }
  parts.sort();
  return parts.join(';');
}
