import { RendererError } from '../internal/errors.js';

export class WebGPUError extends RendererError {
  constructor(code: string, message: string, detail?: unknown) {
    super(code, message, 'webgpu', detail);
  }
}

export class WebGPUPipelineError extends WebGPUError {
  readonly messages: readonly GPUCompilationMessage[];

  constructor(label: string, messages: readonly GPUCompilationMessage[]) {
    super(
      'webgpu/pipeline',
      `pipeline "${label}" failed: ${messages.map((message) => message.message).join('; ') || 'unknown error'}`,
      { messages },
    );
    this.messages = messages;
  }
}

export class WebGPUBindingError extends WebGPUError {
  readonly group: number;
  readonly entryName: string;

  constructor(group: number, name: string, message: string) {
    super('webgpu/binding', `bind group ${group} entry "${name}": ${message}`, { group, name });
    this.group = group;
    this.entryName = name;
  }
}

export class WebGPUCapabilityError extends WebGPUError {
  readonly feature: string;

  constructor(feature: string, message?: string) {
    super('webgpu/capability', message ?? `WebGPU feature "${feature}" is not available`, { feature });
    this.feature = feature;
  }
}

export class WebGPUDeviceLostError extends WebGPUError {
  readonly reason: string;

  constructor(reason: string) {
    super('webgpu/device-lost', `GPU device lost: ${reason}`, { reason });
    this.reason = reason;
  }
}

export class WebGPUResourceError extends WebGPUError {
  readonly resource: string;

  constructor(resource: string) {
    super('webgpu/resource', `${resource} has been destroyed`, { resource });
    this.resource = resource;
  }
}
