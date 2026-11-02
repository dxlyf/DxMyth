/** Internal invariant: a plain Error is intentional (never user-triggerable). */
export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[gpu-renderer] internal assertion failed: ${message}`);
}

export function assertNever(value: never, what: string): never {
  throw new Error(`[gpu-renderer] unhandled ${what}: ${String(value)}`);
}

export function assertDefined<T>(value: T | undefined | null, message: string): T {
  if (value === undefined || value === null) {
    throw new Error(`[gpu-renderer] internal assertion failed: ${message}`);
  }
  return value;
}
