import { RendererError } from '../internal/errors.js';

export type GLStage = 'vertex' | 'fragment' | 'link';

export interface GLDiagnostic {
  readonly stage: GLStage;
  readonly line: number;
  readonly column: number;
  readonly message: string;
  readonly sourceLine: string | null;
}

export class GLError extends RendererError {
  constructor(code: string, message: string, detail?: unknown) {
    super(code, message, 'webgl', detail);
  }
}

export class GLProgramError extends GLError {
  readonly stage: GLStage;
  readonly log: string;
  readonly diagnostics: readonly GLDiagnostic[];
  readonly source: string;

  constructor(options: {
    stage: GLStage;
    label: string;
    log: string;
    diagnostics: readonly GLDiagnostic[];
    source: string;
  }) {
    super(
      'webgl/program',
      `shader ${options.stage} failed for "${options.label}": ${options.log.trim() || 'no log'}`,
      options,
    );
    this.stage = options.stage;
    this.log = options.log;
    this.diagnostics = options.diagnostics;
    this.source = options.source;
  }
}

export class GLCapabilityError extends GLError {
  readonly feature: string;

  constructor(feature: string, message?: string) {
    super('webgl/capability', message ?? `WebGL feature "${feature}" is not available in this context`, { feature });
    this.feature = feature;
  }
}

export class GLFramebufferError extends GLError {
  readonly status: number;

  constructor(status: number, message: string) {
    super('webgl/framebuffer', message, { status });
    this.status = status;
  }
}

export class GLUniformError extends GLError {
  readonly uniform: string;
  readonly expected: string;
  readonly actual: string;

  constructor(uniform: string, expected: string, actual: string) {
    super(
      'webgl/uniform',
      `uniform "${uniform}": expected ${expected}, received ${actual}`,
      { uniform, expected, actual },
    );
    this.uniform = uniform;
    this.expected = expected;
    this.actual = actual;
  }
}

export class GLStateError extends GLError {
  readonly reason: 'no-program' | 'outside-pass' | 'invalid-order';

  constructor(reason: 'no-program' | 'outside-pass' | 'invalid-order', message: string) {
    super('webgl/state', message, { reason });
    this.reason = reason;
  }
}

export class GLResourceError extends GLError {
  readonly resource: string;
  readonly reason: 'destroyed' | 'context-lost';

  constructor(resource: string, reason: 'destroyed' | 'context-lost') {
    super('webgl/resource', `${resource} is ${reason}`, { resource, reason });
    this.resource = resource;
    this.reason = reason;
  }
}
