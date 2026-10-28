/** Error types for the WebGL 1.0 wrapper. */

export class GL1Error extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'GL1Error';
  }
}

export class GL1ProgramError extends GL1Error {
  readonly vertexLog: string;
  readonly fragmentLog: string;

  constructor(message: string, vertexLog: string, fragmentLog: string) {
    super(`${message}\n--- vertex shader ---\n${vertexLog || '<no log>'}\n--- fragment shader ---\n${fragmentLog || '<no log>'}`);
    this.name = 'GL1ProgramError';
    this.vertexLog = vertexLog;
    this.fragmentLog = fragmentLog;
  }
}

export class GL1FramebufferError extends GL1Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(`${message} (status 0x${status.toString(16)})`);
    this.name = 'GL1FramebufferError';
    this.status = status;
  }
}

export class GL1DisposedError extends GL1Error {
  constructor(what: string) {
    super(`${what} has already been disposed`);
    this.name = 'GL1DisposedError';
  }
}
