export type BackendName = 'webgl' | 'webgpu';

/**
 * Base class for every error thrown by this library.
 *
 * `code` is a stable, programmatic identifier (never localized);
 * `message` is for humans and may change between versions.
 */
export class RendererError extends Error {
  readonly code: string;
  readonly backend: BackendName;
  readonly detail: unknown;

  constructor(code: string, message: string, backend: BackendName, detail?: unknown) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.backend = backend;
    this.detail = detail;
  }
}

let nextId = 1;

/** Monotonic id used to disambiguate recycled native handles. */
export function nextResourceId(): number {
  return nextId++;
}
