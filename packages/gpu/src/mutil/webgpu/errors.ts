export class WGPUError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'WGPUError';
  }
}

export class WGPUDeviceLostError extends WGPUError {
  readonly reason: string;

  constructor(message: string, reason = 'unknown') {
    super(message);
    this.name = 'WGPUDeviceLostError';
    this.reason = reason;
  }
}

export class WGPUDisposedError extends WGPUError {
  constructor(what: string) {
    super(`${what} has already been disposed`);
    this.name = 'WGPUDisposedError';
  }
}

export class WGPUPipelineError extends WGPUError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'WGPUPipelineError';
  }
}
