export class GL2Error extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'GL2Error';
  }
}

export class GL2ProgramError extends GL2Error {
  readonly vertexLog: string;
  readonly fragmentLog: string;

  constructor(message: string, vertexLog: string, fragmentLog: string) {
    super(`${message}\n--- vertex shader ---\n${vertexLog || '<no log>'}\n--- fragment shader ---\n${fragmentLog || '<no log>'}`);
    this.name = 'GL2ProgramError';
    this.vertexLog = vertexLog;
    this.fragmentLog = fragmentLog;
  }
}

export class GL2FramebufferError extends GL2Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(`${message} (status 0x${status.toString(16)})`);
    this.name = 'GL2FramebufferError';
    this.status = status;
  }
}

export class GL2DisposedError extends GL2Error {
  constructor(what: string) {
    super(`${what} has already been disposed`);
    this.name = 'GL2DisposedError';
  }
}
